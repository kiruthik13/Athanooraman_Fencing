import concertinaImg from '../assets/concertina.png';
import solarImg from '../assets/solar_fence.png';
import ornamentalImg from '../assets/ornamental.png';

export const sampleProducts = [
    {
        id: 'prod-001',
        name: 'Chain Link Fence - Standard',
        category: 'Chain Link',
        propertyTypes: ['Residential', 'Agriculture', 'Sports Playground'],
        basePrice: 85,
        specifications: {
            height: '6ft',
            material: 'Galvanized Steel',
            gauge: '11 gauge',
            meshSize: '50mm'
        },
        installationTime: '2-3 days',
        features: ['Weather Resistant', 'Low Maintenance', 'Cost Effective'],
        description: 'Durable chain link fencing perfect for residential and agricultural properties. Made from high-quality galvanized steel for long-lasting protection.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']
    },
    {
        id: 'prod-002',
        name: 'Barbed Wire Fence',
        category: 'Barbed Wire',
        propertyTypes: ['Agriculture', 'Open Lands', 'Commercial Security'],
        basePrice: 65,
        specifications: {
            height: '5ft',
            material: 'Galvanized Steel',
            barbType: '4-point barbs',
            wireGauge: '12.5 gauge'
        },
        installationTime: '1-2 days',
        features: ['High Security', 'Rust Resistant', 'Economical'],
        description: 'Heavy-duty barbed wire fencing ideal for securing large agricultural lands and commercial properties. Provides maximum security at an economical price.',
        images: ['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80']
    },
    {
        id: 'prod-003',
        name: 'Welded Mesh Fence',
        category: 'Welded Mesh',
        propertyTypes: ['Residential', 'Commercial Security', 'Landscape'],
        basePrice: 120,
        specifications: {
            height: '6ft',
            material: 'MS Steel',
            meshSize: '75x75mm',
            finish: 'Powder Coated'
        },
        installationTime: '3-4 days',
        features: ['Modern Design', 'High Strength', 'Powder Coated'],
        description: 'Contemporary welded mesh fencing with a sleek modern design. Perfect for residential properties and commercial landscapes requiring both security and aesthetics.',
        images: ['https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80']
    },
    {
        id: 'prod-004',
        name: 'PVC Coated Chain Link',
        category: 'Chain Link',
        propertyTypes: ['Residential', 'Sports Playground', 'Landscape'],
        basePrice: 110,
        specifications: {
            height: '6ft',
            material: 'PVC Coated Steel',
            colors: 'Green/Black',
            meshSize: '50mm'
        },
        installationTime: '2-3 days',
        features: ['Color Options', 'Weather Proof', 'Aesthetic Appeal'],
        description: 'Attractive PVC-coated chain link fencing available in green and black. Combines durability with aesthetic appeal, perfect for residential and sports facilities.',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80']
    },
    {
        id: 'prod-005',
        name: 'Razor Wire Security Fence',
        category: 'Razor Wire',
        propertyTypes: ['Commercial Security', 'Open Lands'],
        basePrice: 95,
        specifications: {
            type: 'Concertina',
            material: 'Stainless Steel',
            diameter: '450mm',
            bladeType: 'Sharp razor blades'
        },
        installationTime: '2-3 days',
        features: ['Maximum Security', 'Corrosion Resistant', 'Deterrent Design'],
        description: 'High-security razor wire fencing designed for maximum protection. Ideal for commercial properties and high-security areas requiring strong deterrent measures.',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80']
    },
    {
        id: 'prod-006',
        name: 'Concertina Coil Fence',
        category: 'Razor Wire',
        propertyTypes: ['Military', 'Industrial', 'High Security'],
        basePrice: 150,
        specifications: {
            diameter: '600mm',
            material: 'Galvanized Spring Steel',
            coilLength: '6m-10m',
            loops: '50 loops/coil'
        },
        installationTime: '1 day',
        features: ['Anti-climb', 'High Tensile', 'Long-lasting'],
        description: 'Top-tier security fencing often used by military and industrial complexes. The spiral razor coils provide an insurmountable physical barrier.',
        images: [concertinaImg]
    },
    {
        id: 'prod-007',
        name: 'Solar Power Fence',
        category: 'Electric Fence',
        propertyTypes: ['Agriculture', 'Farm Houses', 'Forest Borders'],
        basePrice: 200,
        specifications: {
            voltage: '8000V - 10000V',
            powerSource: 'Solar Panel + Battery',
            wireType: 'High Tensile Wire',
            standards: 'IEC 60335-2-76'
        },
        installationTime: '3-5 days',
        features: ['Active Deterrent', 'Solar Powered', 'Alarm System'],
        description: 'Eco-friendly and highly effective active deterrent. Delivers a sharp but safe shock to intruders or animals. Includes alarm integration.',
        images: [solarImg]
    },
    {
        id: 'prod-008',
        name: 'Ornamental Iron Fence',
        category: 'Metal Fence',
        propertyTypes: ['Residential', 'Parks', 'Pools'],
        basePrice: 250,
        specifications: {
            height: '4ft - 6ft',
            material: 'Wrought Iron / Steel',
            finish: 'Black Powder Coat',
            style: 'Classic Spear Top'
        },
        installationTime: '4-5 days',
        features: ['Elegant', 'Durable', 'Timeless Appeal'],
        description: 'Classic ornamental iron fencing that adds prestige and value to any property. Offers the look of traditional wrought iron with modern durability.',
        images: [ornamentalImg]
    }
];
