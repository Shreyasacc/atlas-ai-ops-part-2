import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  X,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Target,
  Zap,
  Cloud,
  Server,
  Database,
  Network,
  Eye,
  Wrench,
  Bell,
  ArrowUpRight,
  FileText,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  TrendingDown as TrendingDownIcon,
  Filter,
  Download,
  ChevronRight
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PageContainer } from '../layouts/PageContainer';
import { CustomDateTimePicker } from '../ui/custom-datetime-picker';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface FinOpsCloudServicesProps {
  onNavigate?: (page: string, params?: Record<string, string>) => void;
  onLogout?: () => void;
}

type ServiceTab = 'Compute' | 'Storage' | 'Network' | 'Database';
type SubTab = 'Overview' | 'Budgets' | 'Anomalies' | 'Alerts' | 'RCA' | 'Optimization';

// Mock data - Service-specific
const serviceSpecificData = {
  Compute: {
    costTrend: [
      { month: 'Jan', cost: 35000 },
      { month: 'Feb', cost: 38000 },
      { month: 'Mar', cost: 42000 },
      { month: 'Apr', cost: 45000 },
      { month: 'May', cost: 42300 },
      { month: 'Jun', cost: 48000 },
    ],
    topCostDrivers: [
      {
        resource: 'ec2-prod-web-01',
        account: 'Production',
        region: 'ap-south-1',
        cost: '₹18,300',
        change: '+22%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'ec2-prod-app-02',
        account: 'Production',
        region: 'ap-south-1',
        cost: '₹12,100',
        change: '+15%',
        optimization: false,
        cloudProvider: 'AWS',
      },
      {
        resource: 'lambda-api-gateway',
        account: 'Production',
        region: 'us-east-1',
        cost: '₹7,800',
        change: '+18%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'vm-prod-web-az-01',
        account: 'Production',
        region: 'eastus',
        cost: '₹16,500',
        change: '+19%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'aks-cluster-prod',
        account: 'Production',
        region: 'westeurope',
        cost: '₹13,200',
        change: '+12%',
        optimization: false,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-functions-prod',
        account: 'Production',
        region: 'centralindia',
        cost: '₹9,800',
        change: '+25%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'gce-prod-instance-01',
        account: 'Production',
        region: 'asia-south1',
        cost: '₹14,700',
        change: '+16%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'gke-cluster-prod',
        account: 'Production',
        region: 'us-central1',
        cost: '₹11,900',
        change: '+10%',
        optimization: false,
        cloudProvider: 'GCP',
      },
      {
        resource: 'cloud-run-api-service',
        account: 'Production',
        region: 'europe-west1',
        cost: '₹6,400',
        change: '+14%',
        optimization: true,
        cloudProvider: 'GCP',
      },
    ],
    anomalies: [
      {
        id: 'CA-001',
        type: 'Cost Spike',
        severity: 'high',
        impact: '₹12,500',
        resource: 'ec2-prod-web-01',
        region: 'ap-south-1',
        detected: '2026-02-01 14:23',
        description: 'Unusual increase in compute hours',
        cloudProvider: 'AWS',
      },
      {
        id: 'CA-002',
        type: 'Auto-scaling Event',
        severity: 'medium',
        impact: '₹8,200',
        resource: 'vm-prod-web-az-01',
        region: 'eastus',
        detected: '2026-02-01 10:15',
        description: 'Azure VM scaled up during peak traffic',
        cloudProvider: 'Azure',
      },
      {
        id: 'CA-003',
        type: 'Idle Resource',
        severity: 'medium',
        impact: '₹5,800',
        resource: 'aks-cluster-prod',
        region: 'westeurope',
        detected: '2026-02-01 08:45',
        description: 'AKS cluster nodes underutilized',
        cloudProvider: 'Azure',
      },
      {
        id: 'CA-004',
        type: 'Cost Spike',
        severity: 'high',
        impact: '₹9,500',
        resource: 'gce-prod-instance-01',
        region: 'asia-south1',
        detected: '2026-01-31 16:30',
        description: 'GCE instance running at high capacity',
        cloudProvider: 'GCP',
      },
    ],
    alerts: [
      {
        id: 'AL-001',
        type: 'Budget Breach',
        severity: 'critical',
        message: 'Production Compute budget exceeded 90%',
        time: '2 hours ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-002',
        type: 'Instance Overprovisioning',
        severity: 'high',
        message: 'EC2 instance running at <30% CPU for 7 days',
        time: '5 hours ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-003',
        type: 'Cost Alert',
        severity: 'high',
        message: 'Azure VM costs increased by 35% this week',
        time: '3 hours ago',
        status: 'active',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-004',
        type: 'Resource Idle',
        severity: 'medium',
        message: 'AKS cluster running with minimal workload',
        time: '1 day ago',
        status: 'acknowledged',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-005',
        type: 'Budget Warning',
        severity: 'medium',
        message: 'GCP Compute Engine costs at 75% of budget',
        time: '6 hours ago',
        status: 'active',
        cloudProvider: 'GCP',
      },
    ],
    optimization: [
      {
        id: 'OPT-001',
        type: 'Rightsizing',
        resource: 'ec2-prod-web-01',
        currentSize: 't3.xlarge',
        recommendedSize: 't3.large',
        savings: '₹5,200/month',
        confidence: 'High',
        reason: 'CPU utilization consistently below 30%',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-002',
        type: 'Reserved Instances',
        resource: 'ec2-prod-app-cluster',
        currentSize: 'On-Demand',
        recommendedSize: '1-Year RI',
        savings: '₹8,500/month',
        confidence: 'High',
        reason: 'Steady usage pattern for 6+ months',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-003',
        type: 'Rightsizing',
        resource: 'vm-prod-web-az-01',
        currentSize: 'Standard_D4s_v3',
        recommendedSize: 'Standard_D2s_v3',
        savings: '₹6,800/month',
        confidence: 'High',
        reason: 'Azure VM consistently below 35% utilization',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-004',
        type: 'Reserved Capacity',
        resource: 'aks-cluster-prod',
        currentSize: 'Pay-as-you-go',
        recommendedSize: '1-Year Reserved',
        savings: '₹9,200/month',
        confidence: 'High',
        reason: 'AKS cluster running 24/7 with stable workload',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-005',
        type: 'Idle Resource',
        resource: 'azure-functions-prod',
        currentSize: 'Premium Plan',
        recommendedSize: 'Consumption Plan',
        savings: '₹4,500/month',
        confidence: 'Medium',
        reason: 'Low invocation rate detected',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-006',
        type: 'Rightsizing',
        resource: 'gce-prod-instance-01',
        currentSize: 'n1-standard-4',
        recommendedSize: 'n1-standard-2',
        savings: '₹5,900/month',
        confidence: 'High',
        reason: 'GCE instance running at 25% average CPU',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-007',
        type: 'Committed Use Discount',
        resource: 'gke-cluster-prod',
        currentSize: 'On-Demand',
        recommendedSize: '1-Year Commitment',
        savings: '₹7,800/month',
        confidence: 'High',
        reason: 'Steady GKE usage pattern for 8+ months',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-008',
        type: 'Preemptible VMs',
        resource: 'gce-batch-processing',
        currentSize: 'Regular VMs',
        recommendedSize: 'Preemptible VMs',
        savings: '₹3,400/month',
        confidence: 'Medium',
        reason: 'Batch workload suitable for preemptible instances',
        cloudProvider: 'GCP',
      },
    ],
    insights: [
      {
        id: 1,
        title: 'Compute cost increased 18% due to auto-scaling events',
        impact: 'high',
      },
      {
        id: 2,
        title: 'Peak usage detected during business hours (9 AM - 6 PM)',
        impact: 'medium',
      },
      {
        id: 3,
        title: '3 instances running with less than 20% CPU utilization',
        impact: 'medium',
      },
    ],
  },
  Storage: {
    costTrend: [
      { month: 'Jan', cost: 28000 },
      { month: 'Feb', cost: 30500 },
      { month: 'Mar', cost: 32000 },
      { month: 'Apr', cost: 33500 },
      { month: 'May', cost: 34200 },
      { month: 'Jun', cost: 35800 },
    ],
    topCostDrivers: [
      {
        resource: 's3-prod-data-lake',
        account: 'Production',
        region: 'us-east-1',
        cost: '₹14,200',
        change: '+8%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'ebs-prod-volumes',
        account: 'Production',
        region: 'ap-south-1',
        cost: '₹9,800',
        change: '+12%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 's3-backup-archive',
        account: 'Backup',
        region: 'us-west-2',
        cost: '₹7,500',
        change: '+5%',
        optimization: false,
        cloudProvider: 'AWS',
      },
      {
        resource: 'azure-blob-prod-data',
        account: 'Production',
        region: 'eastus',
        cost: '₹12,800',
        change: '+15%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-disk-storage',
        account: 'Production',
        region: 'westeurope',
        cost: '₹10,200',
        change: '+9%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-file-share-prod',
        account: 'Production',
        region: 'centralindia',
        cost: '₹6,900',
        change: '+7%',
        optimization: false,
        cloudProvider: 'Azure',
      },
      {
        resource: 'gcs-prod-bucket',
        account: 'Production',
        region: 'asia-south1',
        cost: '₹11,500',
        change: '+11%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'persistent-disk-prod',
        account: 'Production',
        region: 'us-central1',
        cost: '₹8,700',
        change: '+6%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'gcs-archive-storage',
        account: 'Backup',
        region: 'europe-west1',
        cost: '₹5,300',
        change: '+4%',
        optimization: false,
        cloudProvider: 'GCP',
      },
    ],
    anomalies: [
      {
        id: 'SA-001',
        type: 'Idle Resource',
        severity: 'medium',
        impact: '₹3,200',
        resource: 's3-temp-storage',
        region: 'us-east-1',
        detected: '2026-02-01 10:15',
        description: 'Storage bucket not accessed in 30 days',
        cloudProvider: 'AWS',
      },
      {
        id: 'SA-002',
        type: 'Storage Growth',
        severity: 'high',
        impact: '₹4,800',
        resource: 'azure-blob-prod-data',
        region: 'eastus',
        detected: '2026-01-31 16:42',
        description: 'Azure Blob storage growing 25% faster than expected',
        cloudProvider: 'Azure',
      },
      {
        id: 'SA-003',
        type: 'Unused Disks',
        severity: 'medium',
        impact: '₹2,900',
        resource: 'azure-disk-storage',
        region: 'westeurope',
        detected: '2026-01-31 12:20',
        description: 'Multiple unattached Azure managed disks detected',
        cloudProvider: 'Azure',
      },
      {
        id: 'SA-004',
        type: 'Idle Resource',
        severity: 'low',
        impact: '₹1,800',
        resource: 'gcs-archive-storage',
        region: 'europe-west1',
        detected: '2026-01-30 09:15',
        description: 'GCS bucket with minimal access activity',
        cloudProvider: 'GCP',
      },
    ],
    alerts: [
      {
        id: 'AL-003',
        type: 'Storage Threshold',
        severity: 'medium',
        message: 'S3 bucket storage exceeded 5TB threshold',
        time: '1 day ago',
        status: 'acknowledged',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-004',
        type: 'Unused Volumes',
        severity: 'low',
        message: '8 EBS volumes unattached for >14 days',
        time: '2 days ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-005',
        type: 'Cost Spike',
        severity: 'high',
        message: 'Azure Blob storage costs increased 40% this month',
        time: '4 hours ago',
        status: 'active',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-006',
        type: 'Resource Alert',
        severity: 'medium',
        message: 'Azure managed disks consuming excess budget',
        time: '1 day ago',
        status: 'active',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-007',
        type: 'Storage Warning',
        severity: 'low',
        message: 'GCS bucket nearing storage quota limit',
        time: '3 days ago',
        status: 'acknowledged',
        cloudProvider: 'GCP',
      },
    ],
    optimization: [
      {
        id: 'OPT-004',
        type: 'Storage Tiering',
        resource: 's3-archive-data',
        currentSize: 'Standard',
        recommendedSize: 'Glacier',
        savings: '₹2,800/month',
        confidence: 'High',
        reason: 'Infrequent access pattern detected',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-005',
        type: 'Idle Resource',
        resource: 's3-temp-storage',
        currentSize: '500 GB',
        recommendedSize: 'Delete',
        savings: '₹1,500/month',
        confidence: 'High',
        reason: 'No access in last 60 days',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-006',
        type: 'Storage Tiering',
        resource: 'azure-blob-prod-data',
        currentSize: 'Hot Tier',
        recommendedSize: 'Cool Tier',
        savings: '₹3,900/month',
        confidence: 'High',
        reason: 'Access pattern suitable for cool tier',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-007',
        type: 'Cleanup',
        resource: 'azure-disk-storage',
        currentSize: 'Unattached disks',
        recommendedSize: 'Delete unattached',
        savings: '₹2,600/month',
        confidence: 'High',
        reason: '12 unattached managed disks found',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-008',
        type: 'Reserved Capacity',
        resource: 'azure-file-share-prod',
        currentSize: 'Pay-as-you-go',
        recommendedSize: '1-Year Reserved',
        savings: '₹2,100/month',
        confidence: 'Medium',
        reason: 'Consistent usage pattern for file shares',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-009',
        type: 'Storage Class',
        resource: 'gcs-archive-storage',
        currentSize: 'Standard',
        recommendedSize: 'Coldline/Archive',
        savings: '₹1,900/month',
        confidence: 'High',
        reason: 'Rarely accessed data suitable for coldline',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-010',
        type: 'Snapshot Cleanup',
        resource: 'persistent-disk-prod',
        currentSize: 'Multiple snapshots',
        recommendedSize: 'Delete old snapshots',
        savings: '₹1,400/month',
        confidence: 'Medium',
        reason: 'Snapshots older than 90 days detected',
        cloudProvider: 'GCP',
      },
    ],
    insights: [
      {
        id: 1,
        title: 'Storage costs growing 8% monthly due to data lake expansion',
        impact: 'medium',
      },
      {
        id: 2,
        title: '500GB of temporary storage not accessed in 60+ days',
        impact: 'medium',
      },
      {
        id: 3,
        title: 'Moving infrequent data to Glacier could save ₹2,800/month',
        impact: 'high',
      },
    ],
  },
  Network: {
    costTrend: [
      { month: 'Jan', cost: 22000 },
      { month: 'Feb', cost: 23500 },
      { month: 'Mar', cost: 25000 },
      { month: 'Apr', cost: 26200 },
      { month: 'May', cost: 27100 },
      { month: 'Jun', cost: 28500 },
    ],
    topCostDrivers: [
      {
        resource: 'nat-gateway-prod',
        account: 'Production',
        region: 'ap-south-1',
        cost: '₹11,200',
        change: '+18%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'cloudfront-cdn',
        account: 'Production',
        region: 'Global',
        cost: '₹8,900',
        change: '+12%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'data-transfer-out',
        account: 'Production',
        region: 'us-east-1',
        cost: '₹6,500',
        change: '+22%',
        optimization: false,
        cloudProvider: 'AWS',
      },
      {
        resource: 'azure-application-gateway',
        account: 'Production',
        region: 'eastus',
        cost: '₹10,400',
        change: '+16%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-vpn-gateway',
        account: 'Production',
        region: 'westeurope',
        cost: '₹7,800',
        change: '+14%',
        optimization: false,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-bandwidth-egress',
        account: 'Production',
        region: 'centralindia',
        cost: '₹5,900',
        change: '+20%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'cloud-load-balancer',
        account: 'Production',
        region: 'asia-south1',
        cost: '₹9,200',
        change: '+13%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'cloud-nat-gateway',
        account: 'Production',
        region: 'us-central1',
        cost: '₹6,700',
        change: '+11%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'cloud-cdn-egress',
        account: 'Production',
        region: 'Global',
        cost: '₹4,800',
        change: '+9%',
        optimization: false,
        cloudProvider: 'GCP',
      },
    ],
    anomalies: [
      {
        id: 'NA-001',
        type: 'Traffic Spike',
        severity: 'high',
        impact: '₹4,200',
        resource: 'nat-gateway-prod',
        region: 'ap-south-1',
        detected: '2026-02-01 14:23',
        description: 'Unusual increase in data transfer volume',
        cloudProvider: 'AWS',
      },
      {
        id: 'NA-002',
        type: 'Bandwidth Surge',
        severity: 'high',
        impact: '₹5,800',
        resource: 'azure-bandwidth-egress',
        region: 'centralindia',
        detected: '2026-02-01 11:45',
        description: 'Azure egress bandwidth 3x normal levels',
        cloudProvider: 'Azure',
      },
      {
        id: 'NA-003',
        type: 'Cost Anomaly',
        severity: 'medium',
        impact: '₹3,200',
        resource: 'cloud-nat-gateway',
        region: 'us-central1',
        detected: '2026-01-31 16:20',
        description: 'GCP Cloud NAT processing higher than baseline',
        cloudProvider: 'GCP',
      },
    ],
    alerts: [
      {
        id: 'AL-005',
        type: 'Cost Spike',
        severity: 'high',
        message: 'Network egress costs increased by 45% in last 24h',
        time: '5 hours ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-006',
        type: 'NAT Gateway Usage',
        severity: 'medium',
        message: 'NAT Gateway data processing exceeds normal by 35%',
        time: '1 day ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-007',
        type: 'Bandwidth Alert',
        severity: 'high',
        message: 'Azure Application Gateway bandwidth at 85% capacity',
        time: '3 hours ago',
        status: 'active',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-008',
        type: 'VPN Cost',
        severity: 'medium',
        message: 'Azure VPN Gateway costs 30% over budget',
        time: '12 hours ago',
        status: 'acknowledged',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-009',
        type: 'Traffic Warning',
        severity: 'medium',
        message: 'GCP Cloud Load Balancer traffic surge detected',
        time: '8 hours ago',
        status: 'active',
        cloudProvider: 'GCP',
      },
    ],
    optimization: [
      {
        id: 'OPT-007',
        type: 'NAT Gateway',
        resource: 'nat-gateway-prod',
        currentSize: '3 NAT Gateways',
        recommendedSize: '2 NAT Gateways',
        savings: '₹3,200/month',
        confidence: 'Medium',
        reason: 'Traffic can be consolidated to 2 gateways',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-008',
        type: 'Data Transfer',
        resource: 'data-transfer-out',
        currentSize: 'Cross-region',
        recommendedSize: 'Same-region',
        savings: '₹2,500/month',
        confidence: 'High',
        reason: 'Move resources to same region to reduce transfer costs',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-009',
        type: 'Gateway Optimization',
        resource: 'azure-application-gateway',
        currentSize: 'Standard_v2',
        recommendedSize: 'WAF_v2 with autoscaling',
        savings: '₹4,100/month',
        confidence: 'High',
        reason: 'Optimize gateway tier and enable autoscaling',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-010',
        type: 'VPN Consolidation',
        resource: 'azure-vpn-gateway',
        currentSize: 'Multiple Gateways',
        recommendedSize: 'Single Gateway',
        savings: '₹2,900/month',
        confidence: 'Medium',
        reason: 'Consolidate VPN connections to reduce costs',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-011',
        type: 'Regional Optimization',
        resource: 'azure-bandwidth-egress',
        currentSize: 'Multi-region',
        recommendedSize: 'Single-region',
        savings: '₹3,600/month',
        confidence: 'High',
        reason: 'Reduce cross-region bandwidth costs',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-012',
        type: 'Load Balancer Tier',
        resource: 'cloud-load-balancer',
        currentSize: 'Premium',
        recommendedSize: 'Standard',
        savings: '₹2,700/month',
        confidence: 'Medium',
        reason: 'Traffic pattern suitable for standard tier',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-013',
        type: 'NAT Optimization',
        resource: 'cloud-nat-gateway',
        currentSize: 'Multiple NAT IPs',
        recommendedSize: 'Fewer NAT IPs',
        savings: '₹1,800/month',
        confidence: 'Medium',
        reason: 'Reduce number of NAT gateway IPs',
        cloudProvider: 'GCP',
      },
    ],
    insights: [
      {
        id: 1,
        title: 'Network egress costs spiked 45% due to increased API traffic',
        impact: 'high',
      },
      {
        id: 2,
        title: 'Cross-region data transfer accounts for 28% of network costs',
        impact: 'high',
      },
      {
        id: 3,
        title: 'Consolidating NAT Gateways could save ₹3,200/month',
        impact: 'medium',
      },
    ],
  },
  Database: {
    costTrend: [
      { month: 'Jan', cost: 19000 },
      { month: 'Feb', cost: 19800 },
      { month: 'Mar', cost: 20500 },
      { month: 'Apr', cost: 21200 },
      { month: 'May', cost: 21800 },
      { month: 'Jun', cost: 22100 },
    ],
    topCostDrivers: [
      {
        resource: 'rds-prod-mysql',
        account: 'Production',
        region: 'ap-south-1',
        cost: '₹9,500',
        change: '+8%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'dynamodb-sessions',
        account: 'Production',
        region: 'us-east-1',
        cost: '₹6,200',
        change: '+5%',
        optimization: false,
        cloudProvider: 'AWS',
      },
      {
        resource: 'aurora-serverless-prod',
        account: 'Production',
        region: 'eu-west-1',
        cost: '₹4,800',
        change: '+12%',
        optimization: true,
        cloudProvider: 'AWS',
      },
      {
        resource: 'azure-sql-db-prod',
        account: 'Production',
        region: 'eastus',
        cost: '₹10,200',
        change: '+10%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'cosmos-db-prod',
        account: 'Production',
        region: 'westeurope',
        cost: '₹7,800',
        change: '+15%',
        optimization: false,
        cloudProvider: 'Azure',
      },
      {
        resource: 'azure-postgres-flex',
        account: 'Production',
        region: 'centralindia',
        cost: '₹5,900',
        change: '+7%',
        optimization: true,
        cloudProvider: 'Azure',
      },
      {
        resource: 'cloud-sql-mysql-prod',
        account: 'Production',
        region: 'asia-south1',
        cost: '₹8,600',
        change: '+9%',
        optimization: true,
        cloudProvider: 'GCP',
      },
      {
        resource: 'firestore-prod',
        account: 'Production',
        region: 'us-central1',
        cost: '₹6,400',
        change: '+6%',
        optimization: false,
        cloudProvider: 'GCP',
      },
      {
        resource: 'cloud-spanner-prod',
        account: 'Production',
        region: 'europe-west1',
        cost: '₹4,700',
        change: '+11%',
        optimization: true,
        cloudProvider: 'GCP',
      },
    ],
    anomalies: [
      {
        id: 'DA-001',
        type: 'Idle Resource',
        severity: 'medium',
        impact: '₹2,400',
        resource: 'aurora-serverless-prod',
        region: 'eu-west-1',
        detected: '2026-02-01 09:30',
        description: 'Aurora Serverless with minimal activity detected',
        cloudProvider: 'AWS',
      },
      {
        id: 'DA-002',
        type: 'Cost Spike',
        severity: 'high',
        impact: '₹4,200',
        resource: 'cosmos-db-prod',
        region: 'westeurope',
        detected: '2026-02-01 12:15',
        description: 'Azure Cosmos DB throughput spike detected',
        cloudProvider: 'Azure',
      },
      {
        id: 'DA-003',
        type: 'Underutilization',
        severity: 'medium',
        impact: '₹2,800',
        resource: 'azure-sql-db-prod',
        region: 'eastus',
        detected: '2026-01-31 14:50',
        description: 'Azure SQL Database running at 20% capacity',
        cloudProvider: 'Azure',
      },
      {
        id: 'DA-004',
        type: 'Idle Resource',
        severity: 'low',
        impact: '₹1,600',
        resource: 'cloud-spanner-prod',
        region: 'europe-west1',
        detected: '2026-01-30 10:20',
        description: 'Cloud Spanner processing units underutilized',
        cloudProvider: 'GCP',
      },
    ],
    alerts: [
      {
        id: 'AL-007',
        type: 'Storage Growth',
        severity: 'medium',
        message: 'RDS storage utilization reached 80%',
        time: '3 hours ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-008',
        type: 'Cost Warning',
        severity: 'high',
        message: 'DynamoDB on-demand costs increased 55% this week',
        time: '6 hours ago',
        status: 'active',
        cloudProvider: 'AWS',
      },
      {
        id: 'AL-009',
        type: 'Throughput Alert',
        severity: 'high',
        message: 'Azure Cosmos DB RU consumption at 90% of limit',
        time: '2 hours ago',
        status: 'active',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-010',
        type: 'Budget Warning',
        severity: 'medium',
        message: 'Azure SQL Database costs at 80% of monthly budget',
        time: '1 day ago',
        status: 'acknowledged',
        cloudProvider: 'Azure',
      },
      {
        id: 'AL-011',
        type: 'Resource Alert',
        severity: 'low',
        message: 'Cloud SQL instance underutilized for 7 days',
        time: '2 days ago',
        status: 'active',
        cloudProvider: 'GCP',
      },
    ],
    optimization: [
      {
        id: 'OPT-009',
        type: 'Rightsizing',
        resource: 'rds-prod-mysql',
        currentSize: 'db.r5.xlarge',
        recommendedSize: 'db.r5.large',
        savings: '₹2,800/month',
        confidence: 'High',
        reason: 'CPU and memory utilization below 40%',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-010',
        type: 'Reserved Instances',
        resource: 'rds-prod-mysql',
        currentSize: 'On-Demand',
        recommendedSize: '1-Year RI',
        savings: '₹4,200/month',
        confidence: 'High',
        reason: 'Consistent usage for 12+ months',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-011',
        type: 'Table Mode',
        resource: 'dynamodb-sessions',
        currentSize: 'On-Demand',
        recommendedSize: 'Provisioned',
        savings: '₹1,900/month',
        confidence: 'Medium',
        reason: 'Predictable traffic pattern detected',
        cloudProvider: 'AWS',
      },
      {
        id: 'OPT-012',
        type: 'Tier Optimization',
        resource: 'azure-sql-db-prod',
        currentSize: 'Premium',
        recommendedSize: 'General Purpose',
        savings: '₹3,600/month',
        confidence: 'High',
        reason: 'Workload suitable for lower tier',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-013',
        type: 'Throughput Optimization',
        resource: 'cosmos-db-prod',
        currentSize: 'Provisioned 10K RU/s',
        recommendedSize: 'Autoscale 5K-10K RU/s',
        savings: '₹2,900/month',
        confidence: 'High',
        reason: 'Variable workload pattern detected',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-014',
        type: 'Reserved Capacity',
        resource: 'azure-postgres-flex',
        currentSize: 'Pay-as-you-go',
        recommendedSize: '1-Year Reserved',
        savings: '₹2,200/month',
        confidence: 'Medium',
        reason: 'Stable usage pattern for flexible server',
        cloudProvider: 'Azure',
      },
      {
        id: 'OPT-015',
        type: 'Instance Rightsizing',
        resource: 'cloud-sql-mysql-prod',
        currentSize: 'db-n1-standard-4',
        recommendedSize: 'db-n1-standard-2',
        savings: '₹2,700/month',
        confidence: 'High',
        reason: 'Database running at 30% capacity',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-016',
        type: 'Committed Use',
        resource: 'cloud-sql-mysql-prod',
        currentSize: 'On-Demand',
        recommendedSize: '1-Year Commitment',
        savings: '₹3,400/month',
        confidence: 'High',
        reason: 'Steady production workload',
        cloudProvider: 'GCP',
      },
      {
        id: 'OPT-017',
        type: 'Processing Units',
        resource: 'cloud-spanner-prod',
        currentSize: '1000 PUs',
        recommendedSize: '500 PUs',
        savings: '₹1,800/month',
        confidence: 'Medium',
        reason: 'Processing units consistently underutilized',
        cloudProvider: 'GCP',
      },
    ],
    insights: [
      {
        id: 1,
        title: 'Database costs stable with 5% growth due to data volume increase',
        impact: 'low',
      },
      {
        id: 2,
        title: 'Dev databases running 24/7 when only used 8 hours/day',
        impact: 'high',
      },
      {
        id: 3,
        title: 'Reserved instances could save ₹4,200/month on production DB',
        impact: 'high',
      },
    ],
  },
};

const budgetData = [
  { month: 'Jan', budget: 50000, actual: 35000 },
  { month: 'Feb', budget: 50000, actual: 38000 },
  { month: 'Mar', budget: 50000, actual: 42000 },
  { month: 'Apr', budget: 50000, actual: 45000 },
  { month: 'May', budget: 50000, actual: 42300 },
  { month: 'Jun', budget: 50000, actual: 48000 },
];

// Comprehensive budget summary data
const budgetSummaryData = [
  {
    id: 'BDG-001',
    name: 'Production Compute',
    scope: 'Service',
    serviceType: 'Compute',
    budgetAmount: '₹50,000',
    actualSpend: '₹47,200',
    forecastedSpend: '₹52,300',
    utilization: 94,
    status: 'At Risk',
    owner: 'DevOps Team',
    environment: 'Production',
    cloudProvider: 'AWS',
    account: 'prod-account-01',
  },
  {
    id: 'BDG-002',
    name: 'Storage Operations',
    scope: 'Service',
    serviceType: 'Storage',
    budgetAmount: '₹40,000',
    actualSpend: '₹35,800',
    forecastedSpend: '₹38,500',
    utilization: 89,
    status: 'On Track',
    owner: 'Storage Team',
    environment: 'Production',
    cloudProvider: 'AWS',
    account: 'prod-account-01',
  },
  {
    id: 'BDG-003',
    name: 'Network Infrastructure',
    scope: 'Service',
    serviceType: 'Network',
    budgetAmount: '₹35,000',
    actualSpend: '₹28,500',
    forecastedSpend: '₹31,200',
    utilization: 81,
    status: 'On Track',
    owner: 'Network Team',
    environment: 'Production',
    cloudProvider: 'AWS',
    account: 'prod-account-02',
  },
  {
    id: 'BDG-004',
    name: 'Database Services',
    scope: 'Service',
    serviceType: 'Database',
    budgetAmount: '₹25,000',
    actualSpend: '₹22,100',
    forecastedSpend: '₹23,800',
    utilization: 88,
    status: 'On Track',
    owner: 'Database Team',
    environment: 'Production',
    cloudProvider: 'AWS',
    account: 'prod-account-01',
  },
  {
    id: 'BDG-005',
    name: 'Dev Environment',
    scope: 'Project',
    serviceType: 'Compute',
    budgetAmount: '₹15,000',
    actualSpend: '₹16,200',
    forecastedSpend: '₹17,500',
    utilization: 108,
    status: 'Breached',
    owner: 'Development Team',
    environment: 'Development',
    cloudProvider: 'Azure',
    account: 'dev-account-01',
  },
  {
    id: 'BDG-006',
    name: 'UAT Testing',
    scope: 'Project',
    serviceType: 'Compute',
    budgetAmount: '₹10,000',
    actualSpend: '₹7,800',
    forecastedSpend: '₹8,900',
    utilization: 78,
    status: 'On Track',
    owner: 'QA Team',
    environment: 'UAT',
    cloudProvider: 'Azure',
    account: 'uat-account-01',
  },
];

const budgetAlertsData = [
  {
    id: 'BA-001',
    type: 'Budget Breach',
    severity: 'critical',
    message: 'Dev Environment budget exceeded by 8%',
    budgetName: 'Dev Environment',
    timestamp: '2 hours ago',
    threshold: '100%',
    status: 'active',
  },
  {
    id: 'BA-002',
    type: 'Forecast Alert',
    severity: 'high',
    message: 'Production Compute forecasted to breach by month-end',
    budgetName: 'Production Compute',
    timestamp: '5 hours ago',
    threshold: '90%',
    status: 'active',
  },
  {
    id: 'BA-003',
    type: 'Threshold Warning',
    severity: 'medium',
    message: 'Storage Operations reached 75% threshold',
    budgetName: 'Storage Operations',
    timestamp: '1 day ago',
    threshold: '75%',
    status: 'acknowledged',
  },
];

export function FinOpsCloudServices({ onNavigate, onLogout }: FinOpsCloudServicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCustomRangePicker, setShowCustomRangePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [activeService, setActiveService] = useState<ServiceTab>('Compute');
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('Overview');
  const [showViewResourceModal, setShowViewResourceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMarkPlannedModal, setShowMarkPlannedModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [budgetFilters, setBudgetFilters] = useState({
    cloudProvider: [] as string[],
    dateRange: 'Monthly',
    environment: [] as string[],
    account: [] as string[],
    costCenter: [] as string[],
    service: [] as string[],
    owner: [] as string[],
  });
  const [selectedCloudProviders, setSelectedCloudProviders] = useState<string[]>(['AWS']);

  const dateRangeOptions = [
    'Last 7 Days',
    'Last 14 Days',
    'Last 30 Days',
    'Last 90 Days',
    'Last 6 Months',
    'Last 1 Year',
    'Custom Range'
  ];

  const handleDateRangeSelect = (option: string) => {
    if (option === 'Custom Range') {
      setShowCustomRangePicker(true);
    } else {
      setDateRange(option);
      setShowCustomRangePicker(false);
    }
    setShowDateDropdown(false);
  };

  const handleApplyCustomRange = (start: Date, end: Date) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
    setDateRange('Custom Range');
    setShowCustomRangePicker(false);
  };

  const getServiceIcon = (service: ServiceTab) => {
    switch (service) {
      case 'Compute': return Server;
      case 'Storage': return Database;
      case 'Network': return Network;
      case 'Database': return Database;
    }
  };

  const getServiceColor = (service: ServiceTab) => {
    switch (service) {
      case 'Compute': return 'blue';
      case 'Storage': return 'purple';
      case 'Network': return 'green';
      case 'Database': return 'orange';
    }
  };

  const getServiceData = (service: ServiceTab) => {
    const data: Record<ServiceTab, any> = {
      'Compute': { spend: '₹42,300', change: '+12%', budget: 75, anomalies: 2, savings: '₹8,500' },
      'Storage': { spend: '₹35,800', change: '+8%', budget: 62, anomalies: 1, savings: '₹4,300' },
      'Network': { spend: '₹28,500', change: '+15%', budget: 58, anomalies: 0, savings: '₹3,200' },
      'Database': { spend: '₹22,100', change: '+5%', budget: 55, anomalies: 1, savings: '₹2,800' },
    };
    return data[service];
  };

  const ServiceIcon = getServiceIcon(activeService);
  const serviceColor = getServiceColor(activeService);
  const serviceData = getServiceData(activeService);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Get service-specific data
  const currentServiceData = serviceSpecificData[activeService];
  const costTrendData = currentServiceData.costTrend;
  
  // Apply cloud provider filtering
  const topCostDrivers = currentServiceData.topCostDrivers.filter((item: any) => 
    selectedCloudProviders.length === 0 || selectedCloudProviders.includes(item.cloudProvider)
  );
  const anomaliesData = currentServiceData.anomalies.filter((item: any) => 
    selectedCloudProviders.length === 0 || selectedCloudProviders.includes(item.cloudProvider)
  );
  const alertsData = currentServiceData.alerts.filter((item: any) => 
    selectedCloudProviders.length === 0 || selectedCloudProviders.includes(item.cloudProvider)
  );
  const optimizationRecommendations = currentServiceData.optimization.filter((item: any) => 
    selectedCloudProviders.length === 0 || selectedCloudProviders.includes(item.cloudProvider)
  );
  const insights = currentServiceData.insights;

  // Render sub-tab content
  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case 'Overview':
        return (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Total Spend</span>
                  <DollarSign className={`w-4 h-4 text-${serviceColor}-600`} />
                </div>
                <div className="text-2xl text-gray-900">{serviceData.spend}</div>
                <div className="text-xs text-green-600 mt-1">
                  {serviceData.change} vs last period
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Budget Used</span>
                  <Target className={`w-4 h-4 text-${serviceColor}-600`} />
                </div>
                <div className="text-2xl text-gray-900">{serviceData.budget}%</div>
                <div className="text-xs text-gray-600 mt-1">
                  {100 - serviceData.budget}% remaining
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Cost Trend</span>
                  <TrendingUp className={`w-4 h-4 text-${serviceColor}-600`} />
                </div>
                <div className="text-2xl text-green-600">{serviceData.change}</div>
                <div className="text-xs text-gray-600 mt-1">
                  30 day trend
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Active Anomalies</span>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl text-gray-900">{serviceData.anomalies}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Cost anomalies
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Potential Savings</span>
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl text-gray-900">{serviceData.savings}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Monthly estimate
                </div>
              </div>
            </div>

            {/* Cost Trend Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={costTrendData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`#${serviceColor === 'blue' ? '3B82F6' : serviceColor === 'purple' ? 'A855F7' : serviceColor === 'green' ? '10B981' : 'F97316'}`} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={`#${serviceColor === 'blue' ? '3B82F6' : serviceColor === 'purple' ? 'A855F7' : serviceColor === 'green' ? '10B981' : 'F97316'}`} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke={`#${serviceColor === 'blue' ? '3B82F6' : serviceColor === 'purple' ? 'A855F7' : serviceColor === 'green' ? '10B981' : 'F97316'}`}
                    strokeWidth={2}
                    fill="url(#colorCost)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top Cost Drivers */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Top Cost Drivers</h3>
                <Badge variant="outline" className="text-gray-600">{topCostDrivers.length} resources</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Resource</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cloud</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Account</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Region</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Cost</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Change</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCostDrivers.map((driver, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{driver.resource}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            <Cloud className="w-3 h-3 mr-1" />
                            {driver.cloudProvider}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{driver.account}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{driver.region}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{driver.cost}</td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-green-600">{driver.change}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-[#AE275F] hover:bg-[#AE275F]/10"
                            onClick={() => onNavigate?.('rca')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI-Powered Insights */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">AI-Powered Insights</h3>
                <Badge variant="outline" className="text-xs">Powered by AI-OPS</Badge>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        insight.impact === 'high' ? 'bg-red-50' : 'bg-amber-50'
                      }`}>
                        <AlertTriangle className={`w-4 h-4 ${
                          insight.impact === 'high' ? 'text-red-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.title}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[#AE275F] border-[#AE275F] hover:bg-[#AE275F] hover:text-white"
                        onClick={() => setActiveSubTab('RCA')}
                      >
                        View RCA
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => onNavigate?.('anomaly-detection')}
                      >
                        Open in AI-OPS
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'Budgets':
        const totalBudget = budgetSummaryData.reduce((sum, b) => sum + parseInt(b.budgetAmount.replace(/[₹,]/g, '')), 0);
        const totalSpend = budgetSummaryData.reduce((sum, b) => sum + parseInt(b.actualSpend.replace(/[₹,]/g, '')), 0);
        const budgetUtilization = Math.round((totalSpend / totalBudget) * 100);
        const forecastedBreachCount = budgetSummaryData.filter(b => b.status === 'At Risk' || b.status === 'Breached').length;
        const activeBudgetAlerts = budgetAlertsData.filter(a => a.status === 'active').length;
        const overBudgetSpend = budgetSummaryData.filter(b => b.utilization > 100).reduce((sum, b) => {
          const budget = parseInt(b.budgetAmount.replace(/[₹,]/g, ''));
          const actual = parseInt(b.actualSpend.replace(/[₹,]/g, ''));
          return sum + (actual - budget);
        }, 0);

        const getUtilizationColor = (utilization: number) => {
          if (utilization < 70) return 'text-green-600';
          if (utilization < 90) return 'text-amber-600';
          return 'text-red-600';
        };

        const getUtilizationBgColor = (utilization: number) => {
          if (utilization < 70) return 'bg-green-50';
          if (utilization < 90) return 'bg-amber-50';
          return 'bg-red-50';
        };

        const getStatusBadge = (status: string) => {
          switch (status) {
            case 'On Track': return <Badge className="bg-green-100 text-green-700 border-green-200">On Track</Badge>;
            case 'At Risk': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">At Risk</Badge>;
            case 'Breached': return <Badge className="bg-red-100 text-red-700 border-red-200">Breached</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
          }
        };

        // Filter budgets based on filters (not automatically by activeService)
        const filteredBudgets = budgetSummaryData.filter(budget => {
          // Apply service filter from sidebar only
          if (budgetFilters.service.length > 0 && !budgetFilters.service.includes(budget.serviceType)) {
            return false;
          }
          
          // Apply other filters
          if (budgetFilters.cloudProvider.length > 0 && !budgetFilters.cloudProvider.includes(budget.cloudProvider)) {
            return false;
          }
          if (budgetFilters.environment.length > 0 && !budgetFilters.environment.includes(budget.environment)) {
            return false;
          }
          
          // Apply search query
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return budget.name.toLowerCase().includes(query) ||
                   budget.owner.toLowerCase().includes(query) ||
                   budget.serviceType.toLowerCase().includes(query);
          }
          
          return true;
        });

        return (
          <div className="space-y-6">
            {/* 5 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. Total Budget */}
              <div 
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => document.getElementById('budget-summary-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Total Budget</span>
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">₹{totalBudget.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Monthly Period</div>
              </div>

              {/* 2. Budget Utilized */}
              <div 
                className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getUtilizationBgColor(budgetUtilization)}`}
                onClick={() => document.getElementById('budget-vs-actual-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Budget Utilized</span>
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className={`text-2xl mb-1 ${getUtilizationColor(budgetUtilization)}`}>
                  {budgetUtilization}%
                </div>
                <div className="text-xs text-gray-600">₹{totalSpend.toLocaleString()} spent</div>
              </div>

              {/* 3. Forecasted Breach */}
              <div 
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => document.getElementById('forecast-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Forecasted Breach</span>
                  <AlertTriangle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{forecastedBreachCount}</div>
                <div className="text-xs text-orange-600">Budget(s) at risk</div>
              </div>

              {/* 4. Active Budget Alerts */}
              <div 
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => document.getElementById('alerts-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Active Alerts</span>
                  <Bell className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{activeBudgetAlerts}</div>
                <div className="text-xs text-red-600">
                  {budgetAlertsData.find(a => a.status === 'active')?.severity || 'Critical'} severity
                </div>
              </div>

              {/* 5. Over-Budget Spend */}
              <div 
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => document.getElementById('budget-summary-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600 text-xs">Over-Budget Spend</span>
                  <TrendingUp className="w-4 h-4 text-red-600" />
                </div>
                <div className="text-2xl text-red-600 mb-1">
                  ₹{overBudgetSpend > 0 ? overBudgetSpend.toLocaleString() : '0'}
                </div>
                <div className="text-xs text-gray-600">
                  {budgetSummaryData.filter(b => b.utilization > 100).length} budget(s) impacted
                </div>
              </div>
            </div>

            {/* Budget vs Actual Chart */}
            <div id="budget-vs-actual-section" className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Budget vs Actual Spend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={budgetData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    formatter={(value: number) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="budget" fill="#93C5FD" name="Budget" />
                  <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Budget Summary Table */}
            <div id="budget-summary-section" className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Budget Summary</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    All active budgets across services
                    {filteredBudgets.length !== budgetSummaryData.length && ` (${filteredBudgets.length} of ${budgetSummaryData.length} shown)`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilterSidebar(true)}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Budget Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Scope</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Service</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Budget</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actual Spend</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Forecast</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Utilization</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Owner</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBudgets.map((budget) => (
                      <tr 
                        key={budget.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          // Handle row click - could navigate to detail view
                        }}
                      >
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{budget.name}</div>
                          <div className="text-xs text-gray-500">{budget.id}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{budget.scope}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">{budget.serviceType}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{budget.budgetAmount}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{budget.actualSpend}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{budget.forecastedSpend}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getUtilizationColor(budget.utilization)}`}>
                              {budget.utilization}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(budget.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{budget.owner}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#AE275F] hover:bg-[#AE275F]/10"
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubTab('Anomalies');
                              }}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts & Thresholds Section */}
            <div id="alerts-section" className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Budget Alerts & Thresholds</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onNavigate?.('alerting')}
                >
                  Manage Alerts
                </Button>
              </div>

              {/* Threshold Indicators */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Threshold Configuration</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { threshold: 50, label: '50% - Informational', color: 'blue', status: 'Passed' },
                    { threshold: 75, label: '75% - Warning', color: 'amber', status: 'Triggered (2)' },
                    { threshold: 90, label: '90% - Critical', color: 'orange', status: 'Triggered (1)' },
                    { threshold: 100, label: '100% - Breach', color: 'red', status: 'Triggered (1)' },
                  ].map((item, index) => (
                    <div key={index} className={`border-2 border-${item.color}-200 bg-${item.color}-50 rounded-lg p-3`}>
                      <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                      <div className={`text-sm font-medium text-${item.color}-700`}>{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Alerts */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Active Budget Alerts</h4>
                <div className="space-y-3">
                  {budgetAlertsData.map((alert) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            alert.severity === 'critical' ? 'bg-red-50' : 
                            alert.severity === 'high' ? 'bg-orange-50' : 'bg-amber-50'
                          }`}>
                            <Bell className={`w-5 h-5 ${
                              alert.severity === 'critical' ? 'text-red-600' : 
                              alert.severity === 'high' ? 'text-orange-600' : 'text-amber-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-gray-900">{alert.type}</h5>
                              <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                              <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'} className="text-xs">
                                {alert.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              <span>Budget: {alert.budgetName}</span>
                              <span>Threshold: {alert.threshold}</span>
                              <span>{alert.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {alert.status === 'active' && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onNavigate?.('alerting')}
                        >
                          View in AI-OPS
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Forecasting & Predictive Insights */}
            <div id="forecast-section" className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Forecasting & Predictive Insights</h3>
                    <p className="text-xs text-gray-600">Powered by AI-OPS Predictive Engine</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">AI-Powered</Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="text-xs text-gray-600 mb-1">Forecasted End-of-Period Spend</div>
                  <div className="text-2xl font-bold text-purple-600 mb-1">₹182,500</div>
                  <div className="text-xs text-gray-500">vs ₹175,000 budgeted</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <div className="text-xs text-gray-600 mb-1">Expected Breach Date</div>
                  <div className="text-2xl font-bold text-orange-600 mb-1">Feb 24</div>
                  <div className="text-xs text-gray-500">6 days remaining</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-100">
                  <div className="text-xs text-gray-600 mb-1">Confidence Level</div>
                  <div className="text-2xl font-bold text-green-600 mb-1">High</div>
                  <div className="text-xs text-gray-500">92% accuracy</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        Compute budget likely to exceed by 12% due to auto-scaling events
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Based on current usage trends and historical patterns
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900 font-medium">
                        Storage growth trend detected – consider archiving strategy
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Storage costs growing 8% monthly, archiving could save ₹2,800/month
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* View All Budgets CTA */}
            <div className="flex justify-center gap-3">
              <Button 
                className="bg-[#AE275F] hover:bg-[#8B1F4D] text-white"
                onClick={() => onNavigate?.('fin-ops-budgets')}
              >
                View All Budgets
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('fin-ops-budgets')}
              >
                Configure Budget Settings
              </Button>
            </div>
          </div>
        );

      case 'Anomalies':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Cost Anomalies</h3>
                <p className="text-sm text-gray-500 mt-1">Abnormal cost behavior detected for {activeService}</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('anomaly-detection')}
              >
                Open in AI-OPS
              </Button>
            </div>

            {/* Anomalies List */}
            <div className="space-y-3">
              {anomaliesData.map((anomaly) => (
                <div key={anomaly.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        anomaly.severity === 'high' ? 'bg-red-50' : 'bg-amber-50'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 ${
                          anomaly.severity === 'high' ? 'text-red-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{anomaly.type}</h4>
                          <Badge className={getSeverityColor(anomaly.severity)}>{anomaly.severity}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>Resource: {anomaly.resource}</span>
                          <span>Region: {anomaly.region}</span>
                          <span>Impact: {anomaly.impact}</span>
                          <span>Detected: {anomaly.detected}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-red-600">{anomaly.impact}</div>
                      <div className="text-xs text-gray-500">Cost Impact</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-[#AE275F] border-[#AE275F] hover:bg-[#AE275F] hover:text-white"
                      onClick={() => setActiveSubTab('RCA')}
                    >
                      View Cost RCA
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate?.('anomaly-detection')}
                    >
                      Open in AI-OPS
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {anomaliesData.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Cost Anomalies Detected</h3>
                <p className="text-sm text-gray-500">Your {activeService} costs are within normal patterns</p>
              </div>
            )}
          </div>
        );

      case 'Alerts':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Cost & Budget Alerts</h3>
                <p className="text-sm text-gray-500 mt-1">Active alerts for {activeService}</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => onNavigate?.('alerting')}
              >
                Manage Alert Rules
              </Button>
            </div>

            {/* Alerts List */}
            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-lg p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        alert.severity === 'critical' ? 'bg-red-50' : 
                        alert.severity === 'high' ? 'bg-orange-50' : 'bg-amber-50'
                      }`}>
                        <Bell className={`w-5 h-5 ${
                          alert.severity === 'critical' ? 'text-red-600' : 
                          alert.severity === 'high' ? 'text-orange-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{alert.type}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
                          <Badge variant={alert.status === 'active' ? 'destructive' : 'outline'}>
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="text-xs text-gray-500">{alert.time}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {alert.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Acknowledge
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onNavigate?.('alerting')}
                    >
                      View in AI-OPS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'RCA':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Cost Root Cause Analysis</h3>
                <p className="text-sm text-gray-500 mt-1">Why did {activeService} costs change?</p>
              </div>
              <Badge variant="outline" className="text-xs">Powered by AI-OPS</Badge>
            </div>

            {/* RCA Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Root Cause Identified</h4>
                  <p className="text-gray-700 mb-3">
                    {activeService} costs increased by {serviceData.change} due to automatic scaling events triggered by increased traffic during peak hours. Three EC2 instances were auto-scaled from t3.medium to t3.xlarge.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[#AE275F] hover:bg-[#8B1F4D] text-white">
                      View Full RCA Report
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate?.('rca')}
                    >
                      Open in AI-OPS
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Cost Delta */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Cost Delta Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Previous Period</div>
                    <div className="text-xs text-gray-500">Jan 1 - Jan 31</div>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">₹37,768</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Current Period</div>
                    <div className="text-xs text-gray-500">Feb 1 - Feb 28</div>
                  </div>
                  <div className="text-lg font-semibold text-green-600">{serviceData.spend}</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Delta</div>
                    <div className="text-xs text-gray-500">Increase</div>
                  </div>
                  <div className="text-lg font-semibold text-blue-600">+₹4,532 ({serviceData.change})</div>
                </div>
              </div>
            </div>

            {/* Correlated Changes */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Correlated Changes</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Traffic Increase</div>
                    <div className="text-xs text-gray-500">API requests up 45% during 2-4 PM window</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Server className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Auto-Scaling Event</div>
                    <div className="text-xs text-gray-500">3 instances scaled up in ap-south-1 region</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">Extended Runtime</div>
                    <div className="text-xs text-gray-500">Average instance runtime +2.3 hours/day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-medium text-gray-900 mb-4">Recommended Next Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveSubTab('Optimization')}
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Review Optimization Recommendations
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setActiveSubTab('Budgets')}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Adjust Budget Thresholds
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => onNavigate?.('alerting')}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Configure Auto-Scaling Alerts
                </Button>
              </div>
            </div>
          </div>
        );

      case 'Optimization':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Cost Optimization</h3>
                <p className="text-sm text-gray-500 mt-1">Recommendations to reduce {activeService} costs</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{serviceData.savings}</div>
                <div className="text-xs text-gray-500">Potential monthly savings</div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              {optimizationRecommendations.map((rec) => (
                <div key={rec.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{rec.type}</h4>
                          <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                            {rec.confidence} Confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.resource}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Current: {rec.currentSize}</span>
                          <span>→</span>
                          <span className="text-green-600 font-medium">Recommended: {rec.recommendedSize}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 italic">{rec.reason}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold text-green-600">{rec.savings}</div>
                      <div className="text-xs text-gray-500">Estimated savings</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-[#AE275F] border-[#AE275F] hover:bg-[#AE275F] hover:text-white"
                      onClick={() => {
                        setSelectedResource(rec);
                        setShowViewResourceModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Resource
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedResource(rec);
                        setShowMarkPlannedModal(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Planned
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedResource(rec);
                        setShowExportModal(true);
                      }}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingDownIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Total Optimization Potential</h4>
                  <p className="text-sm text-gray-600">
                    Implementing all {optimizationRecommendations.length} recommendations could save up to <span className="font-semibold text-green-600">{serviceData.savings}</span> per month on {activeService} costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout currentPage="fin-ops-cloud-services" onNavigate={onNavigate} onLogout={onLogout}>
      <PageContainer>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] text-white px-8 py-6 rounded-xl mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl mb-2">Cloud Services</h1>
              <p className="text-white/80 text-sm">Manage and optimize cloud service costs</p>
            </div>
            
            {/* Search and Date Range */}
            <div className="flex gap-3 ml-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/80 z-10" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 pl-10 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative flex-shrink-0">
                {!showCustomRangePicker ? (
                  <>
                    <button
                      onClick={() => setShowDateDropdown(!showDateDropdown)}
                      className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg transition-all whitespace-nowrap"
                    >
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{dateRange}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {showDateDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        {dateRangeOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleDateRangeSelect(option)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                              dateRange === option ? "bg-[#AE275F]/10 text-[#AE275F]" : "text-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="absolute right-0 mt-0 z-20">
                    <CustomDateTimePicker
                      startDate={customStartDate}
                      endDate={customEndDate}
                      onApply={handleApplyCustomRange}
                      onCancel={() => setShowCustomRangePicker(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 border-b border-gray-200">
            {(['Compute', 'Storage', 'Network', 'Database'] as ServiceTab[]).map((service) => {
              const Icon = getServiceIcon(service);
              const color = getServiceColor(service);
              return (
                <button
                  key={service}
                  onClick={() => {
                    setActiveService(service);
                    setActiveSubTab('Overview');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                    activeService === service
                      ? `border-${color}-600 text-${color}-600 bg-${color}-50`
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{service}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cloud Provider Filter Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Cloud Provider:</span>
            <div className="flex gap-2">
              {(['AWS', 'Azure', 'GCP'] as const).map((provider) => {
                const isSelected = selectedCloudProviders.includes(provider);
                return (
                  <button
                    key={provider}
                    onClick={() => {
                      // Exclusive selection - clicking a provider shows only that provider's content
                      setSelectedCloudProviders([provider]);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-[#AE275F] text-white border-[#AE275F] shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#AE275F] hover:text-[#AE275F]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Cloud className="w-4 h-4" />
                      {provider}
                    </div>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setSelectedCloudProviders(['AWS'])}
              className="text-sm text-gray-500 hover:text-[#AE275F] transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Sub-Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {(['Overview', 'Budgets', 'Anomalies', 'Alerts', 'RCA', 'Optimization'] as SubTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSubTab === tab
                    ? 'bg-white text-[#AE275F] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Tab Content */}
        {renderSubTabContent()}
      </PageContainer>

      {/* View Resource Modal */}
      {showViewResourceModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-white">Resource Details</h2>
              <button
                onClick={() => {
                  setShowViewResourceModal(false);
                  setSelectedResource(null);
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Resource Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Resource Name</div>
                  <div className="font-medium text-gray-900">{selectedResource.resource}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Optimization Type</div>
                  <div className="font-medium text-gray-900">{selectedResource.type}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Current Configuration</div>
                  <div className="font-medium text-gray-900">{selectedResource.currentSize}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-xs text-gray-500 mb-1">Recommended</div>
                  <div className="font-medium text-green-600">{selectedResource.recommendedSize}</div>
                </div>
              </div>

              {/* Cost Details */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Cost Impact</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Estimated Savings</div>
                      <div className="text-2xl font-bold text-green-600">{selectedResource.savings}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Confidence Level</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedResource.confidence}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Analysis</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedResource.reason}</p>
                </div>
              </div>

              {/* Usage Metrics */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Usage Metrics (Last 30 Days)</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Average CPU Utilization</span>
                    <span className="font-medium text-gray-900">28%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Average Memory Utilization</span>
                    <span className="font-medium text-gray-900">35%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Peak Usage</span>
                    <span className="font-medium text-gray-900">42%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Idle Time</span>
                    <span className="font-medium text-gray-900">18 hours/day</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4D] text-white"
                  onClick={() => {
                    setShowViewResourceModal(false);
                    setSelectedResource(null);
                  }}
                >
                  Apply Recommendation
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowViewResourceModal(false);
                    setSelectedResource(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-white">Export Optimization Report</h2>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setSelectedResource(null);
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Resource Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-xs text-gray-500 mb-1">Exporting Report For</div>
                <div className="font-medium text-gray-900">{selectedResource.resource}</div>
                <div className="text-sm text-gray-600 mt-1">{selectedResource.type}</div>
              </div>

              {/* Format Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Export Format</label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-4 border-2 border-[#AE275F] bg-[#AE275F]/5 rounded-lg hover:bg-[#AE275F]/10 transition-colors">
                    <FileText className="w-6 h-6 text-[#AE275F] mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">PDF</div>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:border-[#AE275F] hover:bg-[#AE275F]/5 transition-colors">
                    <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">CSV</div>
                  </button>
                  <button className="p-4 border border-gray-300 rounded-lg hover:border-[#AE275F] hover:bg-[#AE275F]/5 transition-colors">
                    <FileText className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium text-gray-900">Excel</div>
                  </button>
                </div>
              </div>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>Custom Range</option>
                </select>
              </div>

              {/* Include Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Include in Report</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                    <span className="text-sm text-gray-700">Cost breakdown</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                    <span className="text-sm text-gray-700">Usage metrics</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                    <span className="text-sm text-gray-700">Optimization recommendations</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                    <span className="text-sm text-gray-700">Historical trends</span>
                  </label>
                </div>
              </div>

              {/* Email Option */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                  <span className="text-sm text-gray-700">Email report to my address</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4D] text-white"
                  onClick={() => {
                    // Simulate download
                    alert('Report exported successfully!');
                    setShowExportModal(false);
                    setSelectedResource(null);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowExportModal(false);
                    setSelectedResource(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Planned Modal */}
      {showMarkPlannedModal && selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-white">Mark Optimization as Planned</h2>
              <button
                onClick={() => {
                  setShowMarkPlannedModal(false);
                  setSelectedResource(null);
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Resource Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-xs text-gray-500 mb-1">Resource</div>
                <div className="font-medium text-gray-900">{selectedResource.resource}</div>
                <div className="text-sm text-gray-600 mt-2">{selectedResource.type}</div>
                <div className="text-sm text-green-600 mt-1 font-medium">
                  Expected Savings: {selectedResource.savings}
                </div>
              </div>

              {/* Implementation Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planned Implementation Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                />
              </div>

              {/* Assigned To */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent">
                  <option>Select team member...</option>
                  <option>DevOps Team</option>
                  <option>Cloud Infrastructure Team</option>
                  <option>Cost Optimization Team</option>
                  <option>Engineering Lead</option>
                </select>
              </div>

              {/* Priority */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="p-3 border-2 border-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <div className="text-sm font-medium text-red-700">High</div>
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-[#AE275F] hover:bg-[#AE275F]/5 transition-colors">
                    <div className="text-sm font-medium text-gray-700">Medium</div>
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:border-[#AE275F] hover:bg-[#AE275F]/5 transition-colors">
                    <div className="text-sm font-medium text-gray-700">Low</div>
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea 
                  rows={3}
                  placeholder="Add any notes about the implementation plan..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent resize-none"
                />
              </div>

              {/* Notification */}
              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]" />
                  <span className="text-sm text-gray-700">Send notification to assigned team</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4D] text-white"
                  onClick={() => {
                    alert('Optimization marked as planned successfully!');
                    setShowMarkPlannedModal(false);
                    setSelectedResource(null);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Planned
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowMarkPlannedModal(false);
                    setSelectedResource(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Sidebar */}
      {showFilterSidebar && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowFilterSidebar(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#AE275F] to-[#8B1F4D] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl text-white">Filter Budgets</h2>
              <button
                onClick={() => setShowFilterSidebar(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Cloud Provider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cloud Provider</label>
                <div className="space-y-2">
                  {['AWS', 'Azure', 'GCP'].map((provider) => (
                    <label key={provider} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={budgetFilters.cloudProvider.includes(provider)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBudgetFilters(prev => ({
                              ...prev,
                              cloudProvider: [...prev.cloudProvider, provider]
                            }));
                          } else {
                            setBudgetFilters(prev => ({
                              ...prev,
                              cloudProvider: prev.cloudProvider.filter(p => p !== provider)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                      />
                      <span className="text-sm text-gray-700">{provider}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  value={budgetFilters.dateRange}
                  onChange={(e) => setBudgetFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AE275F] focus:border-transparent"
                >
                  <option>Monthly</option>
                  <option>Quarterly</option>
                  <option>Yearly</option>
                  <option>Custom</option>
                </select>
              </div>

              {/* Environment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Environment</label>
                <div className="space-y-2">
                  {['Production', 'UAT', 'Development'].map((env) => (
                    <label key={env} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={budgetFilters.environment.includes(env)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBudgetFilters(prev => ({
                              ...prev,
                              environment: [...prev.environment, env]
                            }));
                          } else {
                            setBudgetFilters(prev => ({
                              ...prev,
                              environment: prev.environment.filter(e => e !== env)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                      />
                      <span className="text-sm text-gray-700">{env}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Account / Subscription */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Account / Subscription</label>
                <div className="space-y-2">
                  {['prod-account-01', 'prod-account-02', 'dev-account-01', 'uat-account-01'].map((account) => (
                    <label key={account} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={budgetFilters.account.includes(account)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBudgetFilters(prev => ({
                              ...prev,
                              account: [...prev.account, account]
                            }));
                          } else {
                            setBudgetFilters(prev => ({
                              ...prev,
                              account: prev.account.filter(a => a !== account)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                      />
                      <span className="text-sm text-gray-700">{account}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Service</label>
                <div className="space-y-2">
                  {['Compute', 'Storage', 'Network', 'Database'].map((service) => (
                    <label key={service} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={budgetFilters.service.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBudgetFilters(prev => ({
                              ...prev,
                              service: [...prev.service, service]
                            }));
                          } else {
                            setBudgetFilters(prev => ({
                              ...prev,
                              service: prev.service.filter(s => s !== service)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Owner / Team */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Owner / Team</label>
                <div className="space-y-2">
                  {['DevOps Team', 'Storage Team', 'Network Team', 'Database Team', 'Development Team', 'QA Team'].map((owner) => (
                    <label key={owner} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={budgetFilters.owner.includes(owner)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBudgetFilters(prev => ({
                              ...prev,
                              owner: [...prev.owner, owner]
                            }));
                          } else {
                            setBudgetFilters(prev => ({
                              ...prev,
                              owner: prev.owner.filter(o => o !== owner)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-[#AE275F] border-gray-300 rounded focus:ring-[#AE275F]"
                      />
                      <span className="text-sm text-gray-700">{owner}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <Button
                className="flex-1 bg-[#AE275F] hover:bg-[#8B1F4D] text-white"
                onClick={() => setShowFilterSidebar(false)}
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setBudgetFilters({
                    cloudProvider: [],
                    dateRange: 'Monthly',
                    environment: [],
                    account: [],
                    costCenter: [],
                    service: [],
                    owner: [],
                  });
                }}
              >
                Clear All
              </Button>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}