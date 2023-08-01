import { useForm } from "react-hook-form";
import Error from "@/components/error";
import Router from "next/router";
import { useState } from "react";
import axios from "axios";

NewTicket.getInitialProps = async (context, client, currentUser) => {
	return { currentUser };
};

export default function NewTicket() {
	const { register, handleSubmit, formState } = useForm({
		defaultValues: {
			title: "",
			price: "",
		},
	});

	const { errors } = formState;
	const [error, setError] = useState([]);

	const onSubmit = async (data, event) => {
		event.preventDefault();

		try {
			const { title, price } = data;
			const response = await axios.post("/api/tickets", {
				title,
				price,
			});
			Router.push("/");
		} catch (err) {
			setError(err.response.data.errors);
		}
	};

	const onBlur = () => {
		const value = parseFloat(price);

		if (isNaN(value)) {
			return;
		}

		setPrice(value.toFixed(2));
	};

	return (
		<div>
			<h1>Create a Ticket</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="form-group">
					<label>Title</label>
					<input
						className="form-control"
						{...register("title", {
							required: {
								value: true,
								message: "Please enter the title",
							},
						})}
					/>
					<p className="text-danger">{errors.title?.message}</p>
				</div>
				<div className="form-group">
					<label>Price</label>
					<input
						type="number"
						className="form-control"
						onBlur={onBlur}
						{...register("price", {
							required: {
								value: true,
								message: "Please enter the price",
							},
						})}
					/>
					<p className="text-danger">{errors.price?.message}</p>
				</div>
				<button className="btn btn-outline-primary mt-1" type="submit">
					Submit
				</button>
				{error.length > 0 && <Error errorsBack={error} />}
			</form>
		</div>
	);
}
