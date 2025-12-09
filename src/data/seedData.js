import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { sampleProducts } from './sampleProducts';
import { sampleQuotes } from './sampleQuotes';
import { sampleProjects } from './sampleProjects';

export const seedDatabase = async () => {
    try {
        console.log('Starting database seeding...');

        // Seed Products
        console.log('Seeding products...');
        for (const product of sampleProducts) {
            await setDoc(doc(db, 'products', product.id), product);
        }
        console.log(`✓ Seeded ${sampleProducts.length} products`);

        // Seed Quotes
        console.log('Seeding quotes...');
        for (const quote of sampleQuotes) {
            await setDoc(doc(db, 'quotes', quote.id), quote);
        }
        console.log(`✓ Seeded ${sampleQuotes.length} quotes`);

        // Seed Projects
        console.log('Seeding projects...');
        for (const project of sampleProjects) {
            await setDoc(doc(db, 'projects', project.id), project);
        }
        console.log(`✓ Seeded ${sampleProjects.length} projects`);

        console.log('✓ Database seeding completed successfully!');
        return { success: true, message: 'Database seeded successfully!' };
    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, error: error.message };
    }
};

// Call this function from browser console or create a seed button
// seedDatabase();
