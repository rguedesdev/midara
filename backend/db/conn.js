import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

async function main() {
	await mongoose
		.connect(process.env.DATABASE)
		.then(() => console.log("Conectado ao MongoDB!"));
}

main().catch((err) => console.log(err));

export default main;
