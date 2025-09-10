# YouTube Channel Chat App - Admin Dashboard

This document outlines the admin dashboard for the YouTube Channel Chat App, focusing on monitoring crawling, indexing, embedding costs, and system administration.

## Overview

The admin dashboard provides administrators with a comprehensive view of system operations, including channel processing status, job monitoring, usage metrics, and cost tracking. It enables efficient management of resources and troubleshooting of issues.

## Dashboard Architecture

```mermaid
graph TB
    subgraph "Admin Dashboard"
        OV[Overview] --> CM[Channel Management]
        OV --> JM[Job Monitoring]
        OV --> UM[Usage Metrics]
        OV --> CT[Cost Tracking]
        CM --> JC[Job Control]
        JM --> JD[Job Details]
        UM --> UA[User Analytics]
        CT -> CB[Cost Breakdown]
    end
    
    subgraph "Data Sources"
        API[Admin API] --> OV
        API --> CM
        API --> JM
        API --> UM
        API --> CT
    end
    
    subgraph "Actions"
        JC --> API
        JD --> API
    end
```

## 1. Dashboard Layout

### 1.1. Overall Structure

The admin dashboard will have a multi-section layout with navigation:

1. **Overview** - System status and key metrics
2. **Channels** - Channel management and processing status
3. **Jobs** - Background job monitoring and control
4. **Usage** - Usage analytics and metrics
5. **Costs** - Cost tracking and breakdown
6. **Settings** - System configuration

### 1.2. Navigation

```typescript
// src/components/admin/AdminNavigation.tsx
interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminNavigation({ activeTab, onTabChange }: AdminNavigationProps) {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'channels', label: 'Channels', icon: Video },
    { id: 'jobs', label: 'Jobs', icon: Activity },
    { id: 'usage', label: 'Usage', icon: Users },
    { id: 'costs', label: 'Costs', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
  
  return (
    <div className="border-b">
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2 inline" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
```

## 2. Overview Section

### 2.1. System Status Cards

```typescript
// src/components/admin/Overview.tsx
interface SystemStatus {
  channels: {
    total: number;
    active: number;
    processing: number;
  };
  videos: {
    total: number;
    withTranscripts: number;
    withEmbeddings: number;
  };
  conversations: {
    total: number;
    today: number;
  };
  jobs: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  usage: {
    today: {
      requests: number;
      tokensUsed: number;
      cost: number;
    };
    thisMonth: {
      requests: number;
      tokensUsed: number;
      cost: number;
    };
  };
}

export function Overview() {
  const { data: status, isLoading } = useSystemStatus();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Overview</h2>
        <p className="text-muted-foreground">
          Monitor the status of your YouTube Channel Chat App
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Channels"
          value={status.channels.total.toString()}
          description={`${status.channels.active} active, ${status.channels.processing} processing`}
          icon={Video}
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatusCard
          title="Videos"
          value={status.videos.total.toString()}
          description={`${status.videos.withTranscripts} with transcripts`}
          icon={Film}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatusCard
          title="Conversations"
          value={status.conversations.total.toString()}
          description={`${status.conversations.today} today`}
          icon={MessageSquare}
          trend={{ value: 8, isPositive: true }}
        />
        
        <StatusCard
          title="Active Jobs"
          value={status.jobs.processing.toString()}
          description={`${status.jobs.pending} pending, ${status.jobs.failed} failed`}
          icon={Activity}
          trend={{ value: -2, isPositive: false }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart data={status.usage} />
        <JobStatusChart data={status.jobs} />
      </div>
    </div>
  );
}

interface StatusCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
}

function StatusCard({ title, value, description, icon: Icon, trend }: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`flex items-center mt-1 text-xs ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(trend.value)}% from last week
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

### 2.2. Usage Chart

```typescript
// src/components/admin/UsageChart.tsx
interface UsageChartProps {
  data: {
    today: { requests: number; tokensUsed: number; cost: number };
    thisMonth: { requests: number; tokensUsed: number; cost: number };
  };
}

export function UsageChart({ data }: UsageChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Metrics</CardTitle>
        <CardDescription>
          API requests, tokens used, and costs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Requests Today</span>
            <span className="text-sm font-bold">{data.today.requests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tokens Used Today</span>
            <span className="text-sm font-bold">{data.today.tokensUsed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Cost Today</span>
            <span className="text-sm font-bold">${data.today.cost.toFixed(2)}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Requests This Month</span>
            <span className="text-sm font-bold">{data.thisMonth.requests.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Tokens Used This Month</span>
            <span className="text-sm font-bold">{data.thisMonth.tokensUsed.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Cost This Month</span>
            <span className="text-sm font-bold">${data.thisMonth.cost.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2.3. Job Status Chart

```typescript
// src/components/admin/JobStatusChart.tsx
interface JobStatusChartProps {
  data: {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

export function JobStatusChart({ data }: JobStatusChartProps) {
  const chartData = [
    { name: 'Pending', value: data.pending, color: '#f59e0b' },
    { name: 'Processing', value: data.processing, color: '#3b82f6' },
    { name: 'Completed', value: data.completed, color: '#10b981' },
    { name: 'Failed', value: data.failed, color: '#ef4444' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Status</CardTitle>
        <CardDescription>
          Background job processing status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

## 3. Channel Management

### 3.1. Channel List

```typescript
// src/components/admin/ChannelManagement.tsx
interface Channel {
  id: string;
  youtubeChannelId: string;
  title: string;
  thumbnailUrl: string;
  videoCount: number;
  processingStatus: 'pending' | 'processing' | 'completed' | 'error';
  lastSyncedAt: string;
  isActive: boolean;
}

export function ChannelManagement() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  
  useEffect(() => {
    fetchChannels();
  }, []);
  
  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/channels');
      const data = await response.json();
      setChannels(data.data.channels);
    } catch (error) {
      console.error('Failed to fetch channels:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSyncChannel = async (channelId: string) => {
    try {
      await fetch(`/api/admin/channels/${channelId}/sync`, {
        method: 'POST'
      });
      fetchChannels();
    } catch (error) {
      console.error('Failed to sync channel:', error);
    }
  };
  
  const handleToggleChannel = async (channelId: string, isActive: boolean) => {
    try {
      await fetch(`/api/admin/channels/${channelId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });
      fetchChannels();
    } catch (error) {
      console.error('Failed to update channel:', error);
    }
  };
  
  if (isLoading) {
    return <div>Loading channels...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Channel Management</h2>
          <p className="text-muted-foreground">
            Manage YouTube channels and their processing status
          </p>
        </div>
        <Button onClick={() => {/* Open add channel dialog */}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Channel</TableHead>
              <TableHead>Videos</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Synced</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {channels.map((channel) => (
              <TableRow key={channel.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={channel.thumbnailUrl} 
                      alt={channel.title}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{channel.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {channel.youtubeChannelId}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{channel.videoCount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      channel.processingStatus === 'completed' ? 'default' :
                      channel.processingStatus === 'processing' ? 'secondary' :
                      channel.processingStatus === 'error' ? 'destructive' : 'outline'
                    }
                  >
                    {channel.processingStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(channel.lastSyncedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncChannel(channel.id)}
                      disabled={channel.processingStatus === 'processing'}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Switch
                      checked={channel.isActive}
                      onCheckedChange={(checked) => handleToggleChannel(channel.id, checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedChannel(channel.id)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedChannel && (
        <ChannelDetailDialog
          channelId={selectedChannel}
          open={!!selectedChannel}
          onOpenChange={(open) => !open && setSelectedChannel(null)}
          onUpdate={fetchChannels}
        />
      )}
    </div>
  );
}
```

### 3.2. Channel Detail Dialog

```typescript
// src/components/admin/ChannelDetailDialog.tsx
interface ChannelDetailDialogProps {
  channelId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function ChannelDetailDialog({
  channelId,
  open,
  onOpenChange,
  onUpdate
}: ChannelDetailDialogProps) {
  const [channel, setChannel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (open && channelId) {
      fetchChannelDetail();
    }
  }, [open, channelId]);
  
  const fetchChannelDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/channels/${channelId}`);
      const data = await response.json();
      setChannel(data.data);
    } catch (error) {
      console.error('Failed to fetch channel detail:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!channel) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Channel Details</DialogTitle>
          <DialogDescription>
            View and manage channel settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <img 
              src={channel.thumbnailUrl} 
              alt={channel.title}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{channel.title}</h3>
              <p className="text-sm text-muted-foreground">
                {channel.customUrl || channel.youtubeChannelId}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Channel ID</Label>
              <p className="text-sm text-muted-foreground">{channel.youtubeChannelId}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge 
                variant={
                  channel.processingStatus === 'completed' ? 'default' :
                  channel.processingStatus === 'processing' ? 'secondary' :
                  channel.processingStatus === 'error' ? 'destructive' : 'outline'
                }
              >
                {channel.processingStatus}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Videos</Label>
              <p className="text-sm text-muted-foreground">{channel.videoCount}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Last Synced</Label>
              <p className="text-sm text-muted-foreground">
                {channel.lastSyncedAt ? new Date(channel.lastSyncedAt).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">Description</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {channel.description || 'No description available'}
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle save
              onUpdate();
              onOpenChange(false);
            }}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

## 4. Job Monitoring

### 4.1. Job List

```typescript
// src/components/admin/JobMonitoring.tsx
interface Job {
  id: string;
  jobType: string;
  referenceId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  errorMessage?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  metadata: any;
}

export function JobMonitoring() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    jobType: '',
    status: ''
  });
  
  useEffect(() => {
    fetchJobs();
  }, [filters]);
  
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.jobType) params.append('job_type', filters.jobType);
      if (filters.status) params.append('status', filters.status);
      
      const response = await fetch(`/api/admin/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRetryJob = async (jobId: string) => {
    try {
      await fetch(`/api/admin/jobs/${jobId}/retry`, {
        method: 'POST'
      });
      fetchJobs();
    } catch (error) {
      console.error('Failed to retry job:', error);
    }
  };
  
  if (isLoading) {
    return <div>Loading jobs...</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Job Monitoring</h2>
        <p className="text-muted-foreground">
          Monitor and manage background processing jobs
        </p>
      </div>
      
      <div className="flex space-x-4">
        <div className="flex-1">
          <Select
            value={filters.jobType}
            onValueChange={(value) => setFilters({ ...filters, jobType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="channel_sync">Channel Sync</SelectItem>
              <SelectItem value="transcript_extraction">Transcript Extraction</SelectItem>
              <SelectItem value="embedding_generation">Embedding Generation</SelectItem>
              <SelectItem value="knowledge_extraction">Knowledge Extraction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={fetchJobs}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div className="font-medium">
                    {job.jobType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                  {job.referenceId && (
                    <div className="text-sm text-muted-foreground">
                      ID: {job.referenceId.substring(0, 8)}...
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      job.status === 'completed' ? 'default' :
                      job.status === 'processing' ? 'secondary' :
                      job.status === 'failed' ? 'destructive' : 'outline'
                    }
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={job.progress} className="flex-1" />
                    <span className="text-sm font-medium">{job.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(job.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {job.status === 'failed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRetryJob(job.id)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {/* Open job details */}}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
```

## 5. Cost Tracking

### 5.1. Cost Overview

```typescript
// src/components/admin/CostTracking.tsx
interface CostData {
  today: {
    requests: number;
    tokensUsed: number;
    cost: number;
    breakdown: {
      embeddings: number;
      chat: number;
      knowledge: number;
    };
  };
  thisMonth: {
    requests: number;
    tokensUsed: number;
    cost: number;
    breakdown: {
      embeddings: number;
      chat: number;
      knowledge: number;
    };
  };
  monthly: Array<{
    month: string;
    requests: number;
    tokensUsed: number;
    cost: number;
  }>;
}

export function CostTracking() {
  const [costData, setCostData] = useState<CostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchCostData();
  }, []);
  
  const fetchCostData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/costs');
      const data = await response.json();
      setCostData(data.data);
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <div>Loading cost data...</div>;
  }
  
  if (!costData) {
    return <div>Failed to load cost data</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cost Tracking</h2>
        <p className="text-muted-foreground">
          Monitor API usage and associated costs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costData.today.cost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {costData.today.tokensUsed.toLocaleString()} tokens used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${costData.thisMonth.cost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {costData.thisMonth.tokensUsed.toLocaleString()} tokens used
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(costData.monthly.reduce((sum, month) => sum + month.cost, 0) / costData.monthly.length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Last {costData.monthly.length} months
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostBreakdownCard 
          title="Today's Cost Breakdown" 
          breakdown={costData.today.breakdown} 
        />
        <CostBreakdownCard 
          title="This Month's Cost Breakdown" 
          breakdown={costData.thisMonth.breakdown} 
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Cost Trend</CardTitle>
          <CardDescription>
            Cost trends over the past months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyCostChart data={costData.monthly} />
        </CardContent>
      </Card>
    </div>
  );
}

interface CostBreakdownCardProps {
  title: string;
  breakdown: {
    embeddings: number;
    chat: number;
    knowledge: number;
  };
}

function CostBreakdownCard({ title, breakdown }: CostBreakdownCardProps) {
  const total = breakdown.embeddings + breakdown.chat + breakdown.knowledge;
  
  const breakdownItems = [
    { name: 'Embeddings', value: breakdown.embeddings, color: '#3b82f6' },
    { name: 'Chat', value: breakdown.chat, color: '#10b981' },
    { name: 'Knowledge', value: breakdown.knowledge, color: '#f59e0b' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {breakdownItems.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${(item.value / total) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface MonthlyCostChartProps {
  data: Array<{
    month: string;
    requests: number;
    tokensUsed: number;
    cost: number;
  }>;
}

function MonthlyCostChart({ data }: MonthlyCostChartProps) {
  // This would typically use a charting library like recharts or chart.js
  // For simplicity, we'll use a simple bar chart representation
  const maxCost = Math.max(...data.map(d => d.cost));
  
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.month}</span>
            <span>${item.cost.toFixed(2)}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-primary" 
              style={{ width: `${(item.cost / maxCost) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 6. Settings

### 6.1. System Settings

```typescript
// src/components/admin/SystemSettings.tsx
interface SystemSettings {
  youtubeApiKey: string;
  openaiApiKey: string;
  embeddingModel: string;
  chatModel: string;
  maxTokensPerRequest: number;
  dailyQuota: number;
  autoSyncEnabled: boolean;
  syncIntervalHours: number;
}

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      setSettings(data.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    if (!settings) return;
    
    setIsSaving(true);
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      // Show success message
    } catch (error) {
      console.error('Failed to save settings:', error);
      // Show error message
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div>Loading settings...</div>;
  }
  
  if (!settings) {
    return <div>Failed to load settings</div>;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Settings</h2>
        <p className="text-muted-foreground">
          Configure system parameters and API keys
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            Configure API keys and model settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="youtubeApiKey">YouTube API Key</Label>
            <Input
              id="youtubeApiKey"
              type="password"
              value={settings.youtubeApiKey}
              onChange={(e) => setSettings({
                ...settings,
                youtubeApiKey: e.target.value
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
            <Input
              id="openaiApiKey"
              type="password"
              value={settings.openaiApiKey}
              onChange={(e) => setSettings({
                ...settings,
                openaiApiKey: e.target.value
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="embeddingModel">Embedding Model</Label>
            <Select
              value={settings.embeddingModel}
              onValueChange={(value) => setSettings({
                ...settings,
                embeddingModel: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-embedding-ada-002">text-embedding-ada-002</SelectItem>
                <SelectItem value="text-embedding-3-small">text-embedding-3-small</SelectItem>
                <SelectItem value="text-embedding-3-large">text-embedding-3-large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="chatModel">Chat Model</Label>
            <Select
              value={settings.chatModel}
              onValueChange={(value) => setSettings({
                ...settings,
                chatModel: value
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Usage Limits</CardTitle>
          <CardDescription>
            Configure usage limits and quotas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="maxTokensPerRequest">Max Tokens Per Request</Label>
            <Input
              id="maxTokensPerRequest"
              type="number"
              value={settings.maxTokensPerRequest}
              onChange={(e) => setSettings({
                ...settings,
                maxTokensPerRequest: parseInt(e.target.value)
              })}
            />
          </div>
          
          <div>
            <Label htmlFor="dailyQuota">Daily Token Quota</Label>
            <Input
              id="dailyQuota"
              type="number"
              value={settings.dailyQuota}
              onChange={(e) => setSettings({
                ...settings,
                dailyQuota: parseInt(e.target.value)
              })}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Configure automatic synchronization settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoSyncEnabled"
              checked={settings.autoSyncEnabled}
              onCheckedChange={(checked) => setSettings({
                ...settings,
                autoSyncEnabled: checked
              })}
            />
            <Label htmlFor="autoSyncEnabled">Enable Automatic Sync</Label>
          </div>
          
          {settings.autoSyncEnabled && (
            <div>
              <Label htmlFor="syncIntervalHours">Sync Interval (hours)</Label>
              <Input
                id="syncIntervalHours"
                type="number"
                min="1"
                value={settings.syncIntervalHours}
                onChange={(e) => setSettings({
                  ...settings,
                  syncIntervalHours: parseInt(e.target.value)
                })}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
```

## 7. Implementation Roadmap

1. **Phase 1**: Basic Dashboard Structure
   - Create admin dashboard layout and navigation
   - Implement overview section with status cards
   - Add basic system status display

2. **Phase 2**: Channel Management
   - Implement channel list and management
   - Add channel detail view
   - Create channel sync functionality

3. **Phase 3**: Job Monitoring
   - Implement job list with filtering
   - Add job detail view
   - Create job retry functionality

4. **Phase 4**: Cost Tracking
   - Implement cost overview and breakdown
   - Add monthly cost trend chart
   - Create cost forecasting

5. **Phase 5**: Settings Management
   - Implement system settings interface
   - Add API key management
   - Create usage limit configuration

6. **Phase 6**: Advanced Features
   - Add real-time updates with WebSockets
   - Implement export functionality
   - Add user permission management