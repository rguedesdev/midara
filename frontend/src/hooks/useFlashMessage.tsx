import bus from "@/utils/bus";

function useFlashMessage() {
	const setFlashMessage = (msg: string, type: string) => {
		bus.emit("flash", {
			message: msg,
			type: type,
		});
	};

	return { setFlashMessage };
}

export default useFlashMessage;
