import Image from "next/image";
import Sismo from "./components/Sismo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-2 relative bg-gray-100">
      <Image
        src={"/OnlyPenguins.png"}
        alt="Only Penguins"
        height={150}
        width={150}
        className="rounded-full shadow-lg"
      />
      <h1 className="text-2xl font-bold text-blue-800">Only Penguins</h1>
      <h3 className="w-[70rem] text-lg text-center text-gray-700">
        Dive into the cheekiest, fluffiest platform where you can subscribe to
        get exclusive, naughty glimpses of your favorite penguins.
        <strong className="text-blue-600"> Preserve your privacy</strong> and
        let no one know you&apos;re subscribed to Only Penguins! 🐧
      </h3>
      <h2 className="text-lg text-gray-800">
        Sign In With Sismo and then subscribe to see the penguins in their
        birthday suits.
      </h2>
      <h4 className="text-gray-600">It costs 0.1 ETH to subscribe.</h4>
      <Sismo />
    </main>
  );
}
