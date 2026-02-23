"use client";

import React, { createContext, useContext, useState } from "react";

interface UserPlanContextType {
    userPlan: "free" | "pro";
    setUserPlan: (plan: "free" | "pro") => void;
}

const UserPlanContext = createContext<UserPlanContextType>({
    userPlan: "pro",
    setUserPlan: () => { },
});

export function UserPlanProvider({ children }: { children: React.ReactNode }) {
    const [userPlan, setUserPlan] = useState<"free" | "pro">("pro");
    return (
        <UserPlanContext.Provider value={{ userPlan, setUserPlan }}>
            {children}
        </UserPlanContext.Provider>
    );
}

export const useUserPlan = () => useContext(UserPlanContext);
