import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const port = process.env.SERVER_PORT;

// Invocação do express
const app = express();

// Para pegar o corpo bruto da solicitação
// app.use(express.raw({ type: "*/*" }));

// Configuração JSON response > para transformar o corpo da solicitação em JSON
// app.use(express.json());

// Middleware personalizado para analisar o corpo da solicitação com base no Content-Type
app.use((req, res, next) => {
	const contentType = req.headers["content-type"];

	if (contentType === "application/json") {
		express.json()(req, res, next);
	} else {
		express.raw({ type: "*/*" })(req, res, next);
	}
});

// Configuração CORS
app.use(cors({ credentials: true, origin: [process.env.CLIENT_URL] }));

// Importação das Rotas (não funcionais)
import UserRoutes from "./routes/UserRoutes.js";
import StripeRoutes from "./routes/StripeRoutes.js";

// Definição das rotas
app.use("/users", express.json(), UserRoutes);
app.use("/stripe", express.json(), express.raw({ type: "*/*" }), StripeRoutes);

// Configuração do Listen
app.listen(port, () => {
	console.log(`Servidor Rodando na porta ${port}`);
});
