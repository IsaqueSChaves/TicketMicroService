import axios from "axios";

export default function buildClient({ req }) {
	if (req) {
		return axios.create({
			baseURL:
				"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
			headers: req.headers,
		});
	} else {
		return axios.create({
			baseURL: "/",
		});
	}
}
