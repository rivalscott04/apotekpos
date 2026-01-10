import {
    ShieldAlert,
    Database,
    Server,
    Users,
    Activity,
    Zap,
    Lock,
    RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SuperadminDashboardPage() {
    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Superadmin God Mode
                    </h1>
                    <p className="text-muted-foreground">Full system control and monitoring center</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="destructive">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        System Lockdown
                    </Button>
                </div>
            </div>

            {/* System Health Stats */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-slate-950 text-white border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Server Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-green-500" />
                            <span className="text-2xl font-bold">Operational</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Uptime: 99.99%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Database</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-blue-500" />
                            <span className="text-2xl font-bold">Healthy</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Latency: 24ms</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-orange-500" />
                            <span className="text-2xl font-bold">128</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">System Load</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Server className="h-5 w-5 text-purple-500" />
                            <span className="text-2xl font-bold">12%</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Memory Usage: 4.2GB</p>
                    </CardContent>
                </Card>
            </div>

            {/* Danger Zone & Actions */}
            <div className="grid grid-cols-2 gap-6">
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <Zap className="h-5 w-5" />
                            Critical Actions
                        </CardTitle>
                        <CardDescription>
                            High risk actions. Tread carefully, God.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div>
                                <h4 className="font-medium">Flush Redis Cache</h4>
                                <p className="text-sm text-muted-foreground">Clear all session and temporary data</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                Execute
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div>
                                <h4 className="font-medium">Force Database Backup</h4>
                                <p className="text-sm text-muted-foreground">Trigger immediate snapshot</p>
                            </div>
                            <Button size="sm" variant="outline">
                                Start Backup
                            </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-lg border">
                            <div>
                                <h4 className="font-medium">Reset All User Sessions</h4>
                                <p className="text-sm text-muted-foreground">Force logout for everyone</p>
                            </div>
                            <Button size="sm" variant="destructive">
                                Force Logout
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-blue-600" />
                            Access Control & Audit
                        </CardTitle>
                        <CardDescription>Manage granular permissions and view logs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <RefreshCw className="h-4 w-4" />
                            <AlertTitle>System Update Available</AlertTitle>
                            <AlertDescription>
                                Core version v2.1.0 is ready to deploy.
                            </AlertDescription>
                        </Alert>

                        <div className="grid grid-cols-2 gap-3">
                            <Button className="w-full" variant="outline">
                                View Audit Logs
                            </Button>
                            <Button className="w-full" variant="outline">
                                Manage Roles
                            </Button>
                            <Button className="w-full" variant="outline">
                                API Configuration
                            </Button>
                            <Button className="w-full" variant="outline">
                                Environment Vars
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
