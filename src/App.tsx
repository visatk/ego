import { useState } from "react"
import {
  Activity,
  Bot,
  Command as CommandIcon,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldAlert,
  Users,
  Zap,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// --- Mock Data ---
const RECENT_ACTIVITY = [
  { id: "1", user: "@johndoe", command: "/start", time: "2 mins ago", status: "success" },
  { id: "2", user: "@janed", command: "/help", time: "5 mins ago", status: "success" },
  { id: "3", user: "@mike_smith", command: "/generate", time: "12 mins ago", status: "failed" },
  { id: "4", user: "@sarah99", command: "/settings", time: "1 hour ago", status: "success" },
  { id: "5", user: "@alex_dev", command: "/stats", time: "2 hours ago", status: "success" },
]

const SIDEBAR_ITEMS = [
  { title: "Dashboard", icon: LayoutDashboard, isActive: true },
  { title: "Users", icon: Users },
  { title: "Broadcast", icon: MessageSquare },
  { title: "Commands", icon: CommandIcon },
  { title: "Analytics", icon: Activity },
  { title: "Settings", icon: Settings },
]

export default function App() {
  const [isBotActive, setIsBotActive] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bot className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">EgoBot Admin</span>
              <span className="text-xs font-normal text-muted-foreground">Production Environment</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {SIDEBAR_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.isActive} tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {/* Top Navigation */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 transition-[width,height] ease-linear">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2" />
            <div className="hidden w-72 md:block">
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Search className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput placeholder="Search logs, users, or commands..." />
              </InputGroup>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={isBotActive ? "default" : "destructive"} className="hidden sm:inline-flex">
              {isBotActive ? "Online" : "Offline"}
            </Badge>
            <DropdownMenu>
              {/* Applied base ghost button styles directly to avoid invalid DOM nesting and TS errors */}
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring">
                <Avatar size="sm">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Bot Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 space-y-6 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Monitor your Telegram bot's performance and activity.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Settings className="mr-2 size-4" />
                Configure
              </Button>
              <Button>
                <Plus className="mr-2 size-4" />
                New Broadcast
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Logs</TabsTrigger>
              <TabsTrigger value="settings">Quick Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,345</div>
                    <p className="text-xs text-muted-foreground">+18% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Messages Processed</CardTitle>
                    <MessageSquare className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">842.5K</div>
                    <p className="text-xs text-muted-foreground">+5.2% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Commands</CardTitle>
                    <CommandIcon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">3 added recently</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                    <Zap className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142ms</div>
                    <p className="text-xs text-muted-foreground">-12ms from last hour</p>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Table & Secondary Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest command executions from your users.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Command</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {RECENT_ACTIVITY.map((activity) => (
                          <TableRow key={activity.id}>
                            <TableCell className="font-medium">{activity.user}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-mono text-xs">
                                {activity.command}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{activity.time}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={activity.status === "success" ? "default" : "destructive"}>
                                {activity.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                    <CardDescription>Current operational metrics.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Webhook Status</p>
                        <p className="text-sm text-muted-foreground">https://api.egobot.dev/webhook</p>
                      </div>
                      <div className="ml-auto font-medium text-primary">Connected</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Database Latency</p>
                        <p className="text-sm text-muted-foreground">Cloudflare D1 SQLite</p>
                      </div>
                      <div className="ml-auto font-medium">~45ms</div>
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Error Rate</p>
                        <p className="text-sm text-muted-foreground">Last 24 hours</p>
                      </div>
                      <div className="ml-auto font-medium text-destructive">0.02%</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Quick Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Configurations</CardTitle>
                  <CardDescription>Manage your bot's core operational states instantly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Master Switch ensures bot polling/webhook processing logic state */}
                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Bot Processing</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn off to stop the bot from processing incoming Telegram messages.
                      </p>
                    </div>
                    <Switch checked={isBotActive} onCheckedChange={setIsBotActive} />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border p-4">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        <ShieldAlert className="size-4 text-destructive" />
                        Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        When enabled, the bot will auto-reply with a maintenance message to all commands.
                      </p>
                    </div>
                    <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Logs</CardTitle>
                  <CardDescription>View all events, errors, and incoming messages.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed text-sm text-muted-foreground">
                    Logs visualizer placeholder - connect to your logging provider.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
