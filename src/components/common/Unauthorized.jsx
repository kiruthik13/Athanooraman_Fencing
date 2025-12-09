import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
                    <ShieldAlert className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
                <p className="text-lg text-gray-600 mb-8">
                    You don't have permission to access this page.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link to="/signin" className="btn btn-primary">
                        Go to Sign In
                    </Link>
                    <Link to="/" className="btn btn-outline">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
