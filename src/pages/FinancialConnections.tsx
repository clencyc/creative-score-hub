import { useState } from "react";
import Header from "@/components/Header";
import FinancialConnections from "@/components/FinancialConnections";
import { FinancialConnection } from "@/types/database";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const FinancialConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<FinancialConnection[]>([
    {
      id: "conn-001",
      user_id: user?.id || "user-1",
      provider: "mpesa",
      provider_name: "M-Pesa",
      account_identifier: "+254712345678",
      connection_status: "connected",
      last_sync: "2024-02-10T10:30:00Z",
      created_at: "2024-01-15T09:00:00Z"
    },
    {
      id: "conn-002", 
      user_id: user?.id || "user-1",
      provider: "bank",
      provider_name: "KCB Bank",
      account_identifier: "****1234",
      connection_status: "connected",
      last_sync: "2024-02-09T14:45:00Z",
      created_at: "2024-01-20T11:30:00Z"
    }
  ]);

  const handleConnect = (connection: Omit<FinancialConnection, 'id' | 'user_id' | 'created_at' | 'last_sync'>) => {
    const newConnection: FinancialConnection = {
      id: `conn-${Date.now()}`,
      user_id: user?.id || "user-1",
      created_at: new Date().toISOString(),
      last_sync: new Date().toISOString(),
      ...connection
    };
    
    setConnections(prev => [...prev, newConnection]);
    toast({
      title: "Account Connected",
      description: `Successfully connected to ${connection.provider_name}`,
    });
  };

  const handleDisconnect = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    toast({
      title: "Account Disconnected",
      description: "Account has been successfully disconnected",
    });
  };

  const handleSync = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, last_sync: new Date().toISOString() }
        : conn
    ));
    toast({
      title: "Account Synced",
      description: "Account data has been successfully synchronized",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Financial Connections</h1>
            <p className="text-gray-600 mt-2">Connect your financial accounts to improve your credit profile</p>
          </div>

          <FinancialConnections 
            connections={connections}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            onSync={handleSync}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialConnectionsPage;
