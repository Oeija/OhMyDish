"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/login/actions";

export default function LoginForm() {

	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
		const form = new FormData();
		form.append("email", formData.email);
		form.append("password", formData.password);

		await login(form);
		router.push("/"); 
		} catch (err) {
		setError("Invalid email or password.");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-6">
			<div>
				<label htmlFor="email" className="block text-sm">Email</label>
				<input
				id="email"
				name="email"
				type="email"
				required
				value={formData.email}
				onChange={handleChange}
				className="w-full border p-2 rounded"
				/>
			</div>
			<div>
				<label htmlFor="password" className="block text-sm">Password</label>
				<input
				id="password"
				name="password"
				type="password"
				required
				value={formData.password}
				onChange={handleChange}
				className="w-full border p-2 rounded"
				/>
			</div>
			{error && <p className="text-red-500 text-xs">{error}</p>}
			<button type="submit" className="w-full bg-[#493628] text-white p-2 rounded">
				Login
			</button>
		</form>
	);
}
