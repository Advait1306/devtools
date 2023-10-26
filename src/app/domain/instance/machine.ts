interface Machine {
    status: "TERMINATED" | "RUNNING" | "STOPPING" | "PROVISIONING";
    name?: string;
    ip?: string;
}
