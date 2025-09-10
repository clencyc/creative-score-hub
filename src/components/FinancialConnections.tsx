import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Smartphone, 
  Building2, 
  Zap, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Trash2,
  RefreshCw
} from "lucide-react";
import { FinancialConnection } from "@/types/database";
import { toast } from "react-hot-toast";

interface FinancialConnectionsProps {
  connections: FinancialConnection[];
  onConnect: (connection: Omit<FinancialConnection, 'id' | 'user_id' | 'created_at' | 'last_sync'>) => void;
  onDisconnect: (connectionId: string) => void;
  onSync: (connectionId: string) => void;
}

const FinancialConnections = ({ connections, onConnect, onDisconnect, onSync }: FinancialConnectionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newConnection, setNewConnection] = useState({
    provider: '' as 'mpesa' | 'bank' | 'utility',
    provider_name: '',
    account_identifier: '',
    connection_status: 'pending' as const
  });

  const providerIcons = {
    mpesa: <Smartphone className="h-5 w-5 text-green-600" />,
    bank: <Building2 className="h-5 w-5 text-blue-600" />,
    utility: <Zap className="h-5 w-5 text-orange-600" />
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return "bg-green-100 text-green-800";
      case 'pending': return "bg-yellow-100 text-yellow-800";
      case 'failed': return "bg-red-100 text-red-800";
      case 'disconnected': return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleConnect = () => {
    if (!newConnection.provider || !newConnection.provider_name || !newConnection.account_identifier) {
      toast.error("Please fill in all required fields");
      return;
    }

    onConnect(newConnection);
    setNewConnection({
      provider: '' as 'mpesa' | 'bank' | 'utility',
      provider_name: '',
      account_identifier: '',
      connection_status: 'pending'
    });
    setIsDialogOpen(false);
    toast.success("Connection request submitted successfully");
  };

  const mpesaProviders = [
    "Safaricom M-Pesa",
    "Airtel Money",
    "T-Kash"
  ];

  const bankProviders = [
    "Equity Bank",
    "KCB Bank",
    "Cooperative Bank",
    "Absa Bank",
    "Standard Chartered",
    "Diamond Trust Bank",
    "Family Bank",
    "I&M Bank"
  ];

  const utilityProviders = [
    "Kenya Power (KPLC)",
    "Nairobi Water",
    "Safaricom Fibre",
    "Zuku",
    "DStv Kenya"
  ];

  const getProviderOptions = () => {
    switch (newConnection.provider) {
      case 'mpesa': return mpesaProviders;
      case 'bank': return bankProviders;
      case 'utility': return utilityProviders;
      default: return [];
    }
  };

  const getAccountLabel = () => {
    switch (newConnection.provider) {
      case 'mpesa': return "Phone Number";
      case 'bank': return "Account Number";
      case 'utility': return "Account/Meter Number";
      default: return "Account Identifier";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Financial Connections
            </CardTitle>
            <CardDescription>
              Connect your M-Pesa, bank accounts, and utility payments to improve your credit profile
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Connection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Financial Connection</DialogTitle>
                <DialogDescription>
                  Connect your financial accounts to build a comprehensive credit profile
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="provider">Provider Type</Label>
                  <Select 
                    value={newConnection.provider} 
                    onValueChange={(value: 'mpesa' | 'bank' | 'utility') => 
                      setNewConnection({...newConnection, provider: value, provider_name: ''})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa / Mobile Money</SelectItem>
                      <SelectItem value="bank">Bank Account</SelectItem>
                      <SelectItem value="utility">Utility Payments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newConnection.provider && (
                  <div>
                    <Label htmlFor="provider_name">Provider</Label>
                    <Select 
                      value={newConnection.provider_name} 
                      onValueChange={(value) => setNewConnection({...newConnection, provider_name: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {getProviderOptions().map((provider) => (
                          <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="account_identifier">{getAccountLabel()}</Label>
                  <Input
                    id="account_identifier"
                    placeholder={`Enter your ${getAccountLabel().toLowerCase()}`}
                    value={newConnection.account_identifier}
                    onChange={(e) => setNewConnection({...newConnection, account_identifier: e.target.value})}
                  />
                </div>

                <Button onClick={handleConnect} className="w-full">
                  Connect Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {connections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No financial connections yet</p>
            <p className="text-sm">Connect your accounts to build your credit profile</p>
          </div>
        ) : (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {providerIcons[connection.provider]}
                  <div>
                    <div className="font-medium">{connection.provider_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {connection.account_identifier}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last sync: {new Date(connection.last_sync).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(connection.connection_status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(connection.connection_status)}
                      {connection.connection_status}
                    </div>
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSync(connection.id)}
                      disabled={connection.connection_status !== 'connected'}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDisconnect(connection.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Benefits of Connecting Accounts</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Automatically track payment history</li>
            <li>• Improve credit score with consistent payments</li>
            <li>• Get personalized financial insights</li>
            <li>• Faster loan and grant application processing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialConnections;
