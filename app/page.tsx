import Link from "next/link";

export default function Home() {
    return (
        <main className="flex flex-col items-center text-center bg-emerald-900 min-h-screen justify-center  gap-12">
            <div>
                <h2 className="text-4xl">A <b>glance</b> into who you are</h2>
                <p className="text-2xl mt-4">A living page that shows what you're building, watching, reading, listening to, and exploring.</p>
            </div>
            <div>
                <Link href="/signup" className="border rounded p-2 cursor-pointer bg-emerald-700 border-emerald-500 active:scale-95 duration-75">Create your Glance</Link>
            </div>
        </main>
    );
}
