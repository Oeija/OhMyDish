"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Control = () => {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<any[]>([]); // State for users list
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRole() {
            const userRole = await fetchUserRole();
            setRole(userRole);
            setLoading(false);
        }
        fetchRole();
    }, []);

    useEffect(() => {
        async function fetchUsers() {
            const response = await fetch('/app/api/get-users'); 
            const data = await response.json();
            console.log('Users Data Test:', data);
            setUsers(data.users); 
        }
        fetchUsers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (role !== "admin") {
        router.push("/");
        return null;
    }

    const handleBanUser = async (id: string) => {
        if (!id) return;

        const response = await fetch('/app/api/ban-user', {
            method: 'POST',
            body: JSON.stringify({ userId: id }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.success) {
            console.log("User banned successfully");
            setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        } else {
            console.error("Failed to ban user");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">

            <div className="flex flex-col gap-4 mb-12 pt-36">
                <div className="flex flex-col items-center text-center">
                    <h1 className="control__title">Control Settings</h1>
                    <p className="control__subtitle">
                        Ban users who violated the terms and conditions.
                    </p>
                </div>

                <div className="w-full">
                    <h2 className="mb-4">Users List</h2>
                    <div className="space-y-4">
                        {users.map((user: any) => (
                            <div key={user.id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                                <p>{user.email}</p>
                                <button
                                    onClick={() => handleBanUser(user.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                >
                                    Ban User
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

async function fetchUserRole() {
    return "admin"; 
}

export default Control;
