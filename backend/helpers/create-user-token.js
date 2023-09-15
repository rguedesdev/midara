import jwt from "jsonwebtoken";

const createUserToken = async (user, req, res) => {
	// Criar Token
	const token = jwt.sign(
		{
			name: user.name,
			id: user._id,
		},
		process.env.JWT_SECRET
	);

	// Retornar Token
	res.status(200).json({
		messsage: "Você está autenticado!",
		token: token,
		userId: user._id,
	});
};
export default createUserToken;
