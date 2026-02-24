import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Loader2,
  FileText,
  ArrowRightLeft,
  Send
} from 'lucide-react@0.468.0';
import { CreateEstimateModal } from './CreateEstimateModal';
import { EstimateViewModal } from './EstimateViewModal';
import { toast } from '../ui/sonner';
import { fetchEstimates, deleteEstimate } from '../../utils/dashboard-api';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../ui/alert-dialog';

interface EstimatesTabProps {
  userPlan: 'basic' | 'premium';
}

export function EstimatesTab({ userPlan }: EstimatesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [estimates, setEstimates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingEstimate, setViewingEstimate] = useState<any>(null);
  const [deletingEstimate, setDeletingEstimate] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const estimatesData = await fetchEstimates();
      setEstimates(estimatesData);
    } catch (error) {
      console.error('Error loading estimates data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch =
      estimate.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const draftCount = estimates.filter(e => e.status === 'draft').length;
  const sentCount = estimates.filter(e => e.status === 'sent').length;
  const approvedCount = estimates.filter(e => e.status === 'approved').length;
  const rejectedCount = estimates.filter(e => e.status === 'rejected').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'converted':
        return <ArrowRightLeft className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'sent':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'converted':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDelete = async () => {
    if (!deletingEstimate) return;
    setIsDeleting(true);
    try {
      await deleteEstimate(deletingEstimate.id);
      setEstimates(prev => prev.filter(e => e.id !== deletingEstimate.id));
      toast.success('Estimate deleted');
      setDeletingEstimate(null);
    } catch (error) {
      console.error('Error deleting estimate:', error);
      toast.error('Failed to delete estimate');
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = (status: string) => status === 'draft' || status === 'rejected';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Estimates
          </h2>
          <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Create and manage estimates for your customers
          </p>
        </div>
        <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white rounded-lg" onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Estimate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Draft</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {draftCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sent</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {sentCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {approvedCount}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                {rejectedCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search estimates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Mobile Estimate Cards */}
      <div className="sm:hidden space-y-3">
        {loading ? (
          <Card className="p-4 border-gray-200 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
          </Card>
        ) : filteredEstimates.length > 0 ? (
          filteredEstimates.map((estimate) => (
            <Card key={estimate.id} className="p-4 border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                    {estimate.number || estimate.id}
                  </p>
                  <p className="text-sm text-gray-600 mt-0.5">{estimate.customer}</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(estimate.status)}`}>
                  {getStatusIcon(estimate.status)}
                  {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                ${(estimate.total || 0).toFixed(2)}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span>
                  {estimate.date
                    ? new Date(estimate.date).toLocaleDateString()
                    : estimate.createdAt
                      ? new Date(estimate.createdAt).toLocaleDateString()
                      : 'N/A'}
                </span>
                {estimate.validUntil && (
                  <span>Valid until: {new Date(estimate.validUntil).toLocaleDateString()}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="h-8 px-3 text-xs border-gray-300 flex-1"
                  onClick={() => setViewingEstimate(estimate)}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
                {canDelete(estimate.status) && (
                  <button
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    onClick={() => setDeletingEstimate(estimate)}
                    title="Delete estimate"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-4 border-gray-200 text-center text-gray-500 text-sm">
            No estimates found
          </Card>
        )}
      </div>

      {/* Estimates Table */}
      <Card className="border-gray-200 overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Estimate
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Valid Until
                </th>
                <th className="px-3 sm:px-6 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </td>
                </tr>
              ) : filteredEstimates.length > 0 ? (
                filteredEstimates.map((estimate) => (
                  <tr key={estimate.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        {estimate.number || estimate.id}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{estimate.customer}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900" style={{ fontFamily: 'Roboto Mono, monospace' }}>
                        ${(estimate.total || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${getStatusColor(estimate.status)}`}>
                        {getStatusIcon(estimate.status)}
                        {estimate.status.charAt(0).toUpperCase() + estimate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {estimate.date
                          ? new Date(estimate.date).toLocaleDateString()
                          : estimate.createdAt
                            ? new Date(estimate.createdAt).toLocaleDateString()
                            : 'N/A'
                        }
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {estimate.validUntil ? new Date(estimate.validUntil).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          className="h-8 px-3 text-xs border-gray-300"
                          onClick={() => setViewingEstimate(estimate)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {canDelete(estimate.status) && (
                          <button
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            onClick={() => setDeletingEstimate(estimate)}
                            title="Delete estimate"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No estimates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Estimate View Modal */}
      {viewingEstimate && (
        <EstimateViewModal
          estimate={viewingEstimate}
          onClose={() => setViewingEstimate(null)}
          onUpdate={() => loadData()}
        />
      )}

      {/* Delete Estimate Dialog */}
      <AlertDialog open={!!deletingEstimate} onOpenChange={(open) => { if (!open) setDeletingEstimate(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ fontFamily: 'Poppins, sans-serif' }}>
              Delete Estimate
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete estimate {deletingEstimate?.number || deletingEstimate?.id}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Estimate Modal */}
      {showCreateModal && (
        <CreateEstimateModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
