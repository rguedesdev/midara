import axios from "axios";

// Criando uma URL base para a API
export default axios.create({
	baseURL: process.env.NEXT_PUBLIC_API,
});
