import axios from "axios";

// Criando uma URL base para a API
export default axios.create({
	baseURL: "http://localhost:5000",
});
