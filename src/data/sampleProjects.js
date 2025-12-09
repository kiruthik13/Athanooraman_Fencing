export const sampleProjects = [
    {
        id: 'proj-001',
        projectId: 'PR-001',
        quoteId: 'quote-002',
        customerId: 'cust-002',
        customerName: 'Priya Sharma',
        productId: 'prod-003',
        productName: 'Welded Mesh Fence',
        status: 'In Progress',
        progress: 65,
        startDate: '2024-11-20',
        estimatedCompletion: '2024-12-05',
        completedDate: null,
        branch: 'Chennai',
        engineerId: 'eng-001',
        engineerName: 'Suresh Kumar',
        milestones: [
            { name: 'Foundation', status: 'Completed', date: '2024-11-22' },
            { name: 'Installation', status: 'In Progress', date: null },
            { name: 'Testing', status: 'Pending', date: null }
        ],
        photos: [],
        notes: ['Site preparation completed', 'Material delivered on time'],
        createdAt: '2024-11-20',
        updatedAt: '2024-11-28'
    },
    {
        id: 'proj-002',
        projectId: 'PR-002',
        quoteId: 'quote-003',
        customerId: 'cust-003',
        customerName: 'Mohammed Ali',
        productId: 'prod-002',
        productName: 'Barbed Wire Fence',
        status: 'In Progress',
        progress: 40,
        startDate: '2024-11-22',
        estimatedCompletion: '2024-12-08',
        completedDate: null,
        branch: 'Hyderabad',
        engineerId: 'eng-002',
        engineerName: 'Ravi Verma',
        milestones: [
            { name: 'Foundation', status: 'Completed', date: '2024-11-24' },
            { name: 'Installation', status: 'In Progress', date: null }
        ],
        photos: [],
        notes: ['Large area project', 'Weather conditions favorable'],
        createdAt: '2024-11-22',
        updatedAt: '2024-11-27'
    },
    {
        id: 'proj-003',
        projectId: 'PR-003',
        quoteId: 'quote-004',
        customerId: 'cust-004',
        customerName: 'Lakshmi Menon',
        productId: 'prod-004',
        productName: 'PVC Coated Chain Link',
        status: 'Completed',
        progress: 100,
        startDate: '2024-11-10',
        estimatedCompletion: '2024-11-24',
        completedDate: '2024-11-24',
        branch: 'Coimbatore',
        engineerId: 'eng-003',
        engineerName: 'Karthik Raj',
        milestones: [
            { name: 'Foundation', status: 'Completed', date: '2024-11-12' },
            { name: 'Installation', status: 'Completed', date: '2024-11-20' },
            { name: 'Testing', status: 'Completed', date: '2024-11-24' }
        ],
        photos: [],
        notes: ['Project completed ahead of schedule', 'Customer very satisfied'],
        createdAt: '2024-11-10',
        updatedAt: '2024-11-24'
    }
];
