"use client";

declare global {
  interface Window {
    ethereum: any;
  }
}

import { useState } from "react";
import { dataNotPaid, dataPaid } from "../data";
import Penguin from "./Penguin";
import {
  AuthType,
  ClaimType,
  SismoConnectButton,
  SismoConnectResponse,
} from "@sismo-core/sismo-connect-react";
import { ethers, parseEther } from "ethers";

function Sismo() {
  const [hasPaid, setHasPaid] = useState(false);
  const [userId, setUserId] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState(0);

  const pudgyPenguinsGroupId = "0xf002554351fe264d75f59e7fba89c2e6";

  const subscribe = async () => {
    try {
      setLoading(true);
      const price = Math.max(0.1 - (tokens || 0) * 0.001, 0);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: "0x28f93e363770fD59134fD2b72604fd983b5b5266",
        value: parseEther(price.toString()),
      });
      await tx.wait();
      const res = await fetch("/api/paid", {
        method: "PATCH",
        body: JSON.stringify(userId),
      });
      if (res.status === 200) {
        setHasPaid(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        {hasPaid
          ? dataPaid.map((penguin) => (
              <Penguin
                key={penguin.name}
                name={penguin.name}
                description={penguin.description}
                image={penguin.image}
                age={penguin.age}
              />
            ))
          : dataNotPaid.map((penguin) => (
              <Penguin
                key={penguin.name}
                name={penguin.name}
                description={penguin.description}
                image={penguin.image}
                age={penguin.age}
              />
            ))}
      </div>
      <div className="absolute top-10 right-10">
        {!isSignedIn ? (
          <SismoConnectButton
            config={{
              appId: "0xbffb8652509c7e27e0b0485beade19c2",
              vault: {
                impersonate: ["nansen.eth", "jebus.eth"],
              },
            }}
            auths={[{ authType: AuthType.VAULT }]}
            claims={[
              {
                groupId: pudgyPenguinsGroupId,
                claimType: ClaimType.GTE,
                value: 1,
                isOptional: true,
                isSelectableByUser: true,
              },
            ]}
            onResponse={async (response: SismoConnectResponse) => {
              const res = await fetch("/api/verify", {
                method: "POST",
                body: JSON.stringify(response),
              });
              if (res.status === 200) {
                const { userId, paid, tokens } = await res.json();
                setUserId(userId);
                setHasPaid(paid);
                setTokens(tokens);
                setIsSignedIn(true);
              }
            }}
          />
        ) : (
          <h4>
            UserID:{" "}
            {userId.substring(0, 4) +
              "..." +
              userId.substring(userId.length - 2)}
          </h4>
        )}
      </div>
      {!hasPaid ? (
        <>
          {isSignedIn && (
            <h4>
              You have {tokens || 0} Pengus, saving you {(tokens || 0) * 0.001}
              ETH. Your subscription cost is only{" "}
              {Math.max(0.1 - (tokens || 0) * 0.001, 0)}ETH!
            </h4>
          )}
          <button
            onClick={subscribe}
            className={`bg-purple-500 text-white px-4 py-2 rounded ${
              !isSignedIn && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isSignedIn || loading}
          >
            {loading ? <p>Loading...</p> : <p>Subscribe Here</p>}
          </button>
        </>
      ) : (
        <p>Thank you for subscribing!</p>
      )}
    </>
  );
}

export default Sismo;
