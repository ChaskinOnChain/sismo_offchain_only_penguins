import prismadb from "@/prismadb";
import {
  AuthType,
  ClaimType,
  SismoConnect,
  SismoConnectVerifiedResult,
} from "@sismo-core/sismo-connect-server";
import { NextRequest, NextResponse } from "next/server";

const pudgyPenguinsGroupId = "0xf002554351fe264d75f59e7fba89c2e6";

const sismoConnect = SismoConnect({
  config: {
    appId: "0xbffb8652509c7e27e0b0485beade19c2",
    vault: {
      impersonate: ["nansen.eth", "jebus.eth"],
    },
  },
});

export async function POST(req: NextRequest) {
  const sismoConnectResponse = await req.json();
  try {
    const result: SismoConnectVerifiedResult = await sismoConnect.verify(
      sismoConnectResponse,
      {
        auths: [{ authType: AuthType.VAULT }],
        claims: [
          {
            groupId: pudgyPenguinsGroupId,
            claimType: ClaimType.GTE,
            value: 1,
            isOptional: true,
            isSelectableByUser: true,
          },
        ],
      }
    );

    const vaultId = result.getUserId(AuthType.VAULT);

    let tokens;

    if (result.claims.length === 0) {
      tokens = 0;
    } else {
      tokens = result.claims[0].value;
    }

    let userPaidStatus = false;

    if (vaultId) {
      const existingUser = await prismadb.user.findFirst({
        where: { id: vaultId },
      });

      if (existingUser) {
        userPaidStatus = existingUser.paid;
      } else {
        await prismadb.user.create({
          data: {
            id: vaultId,
            tokens,
            paid: false,
          },
        });
      }
    } else {
      return NextResponse.json("Invalid response", { status: 400 });
    }

    return NextResponse.json(
      { userId: vaultId, paid: userPaidStatus, tokens },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
