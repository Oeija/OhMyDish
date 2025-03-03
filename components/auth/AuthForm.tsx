"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/auth-ui/tabs";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

export function AuthForm() {
	const [activeTab, setActiveTab] = useState("login");

	return (
		<div className="flex h-screen w-full">
			
			<div className="w-full h-full bg-[#8B4513] flex flex-col justify-center items-center text-white text-center p-8">
				<h1 className="text-4xl font-bold">Welcome to OhMyDish!</h1>
				<p className="text-lg mt-2">Discover recipes that bring joy to your table.</p>
				<img src="/ingredients2.png" alt="Welcome" className="mt-5 w-[50%]" />
			</div>

			<div className="w-full h-full bg-white flex justify-center items-center">
				<div className="w-full max-w-md">
					<Tabs defaultValue="login" className="w-full">
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger
								className={activeTab === "login" ? "text-base font-bold" : "text-base font-normal"}
								value="login"
								onClick={() => setActiveTab("login")}
							>
								Login
							</TabsTrigger>
							<TabsTrigger
								className={activeTab === "signup" ? "text-base font-bold" : "text-base font-normal"}
								value="signup"
								onClick={() => setActiveTab("signup")}
							>
								Sign Up
							</TabsTrigger>
						</TabsList>
						<div className="relative mt-5">
							<div className={activeTab === "login" ? "block" : "hidden"}>
								<LoginForm />
							</div>
							<div className={activeTab === "signup" ? "block" : "hidden"}>
								<SignUpForm />
							</div>
						</div>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
