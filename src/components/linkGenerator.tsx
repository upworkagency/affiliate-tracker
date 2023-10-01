"use client"
import React, { useState, useRef } from 'react';
interface LinkGeneratorProps {
    id: string;
}
const LinkGenerator: React.FC<LinkGeneratorProps> = ({ id }) => {
    const [platform, setPlatform] = useState<string>('');
    const [accountId, setAccountId] = useState<string>(id ?? '');
    const [eventId, setEventId] = useState<string>('');
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const linkInputRef = useRef<HTMLInputElement | null>(null);

    const handleGenerateLink = () => {
        const baseUrl = "https://www.clubdenegocios.io/api/calendly?";
        const queryParams = `platform=${platform}&accountId=${accountId}&eventId=3b0bfa02-8d78-4865-ad91-405744270db4`;
        setGeneratedLink(baseUrl + queryParams);
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink);
            alert("Link copied to clipboard!");
        } catch (err) {
            alert("Failed to copy the link. Please manually select and copy.");
        }
    };

    const handleReset = () => {
        setPlatform('');
        setAccountId('');
        setEventId('');
        setGeneratedLink('');
    };

    return (
        <div className="link-generator p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-medium text-gray-700 mb-3">Generate Booking Link:</h2>

            <div className="input-group mb-3">
                <label className="block text-gray-600 mb-1 text-sm">Social Media Platform:</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-1 border rounded text-sm">
                    <option value="">Select Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                </select>
            </div>

            <div className="input-group mb-3">
                <label className="block text-gray-600 mb-1 text-sm">Account ID:</label>
                <input type="text" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full p-1 border rounded text-sm" />
            </div>

            <div className="input-group mb-3">
                <label className="block text-gray-600 mb-1 text-sm">Event ID:</label>
                <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} className="w-full p-1 border rounded text-sm" />
            </div>

            <div className="mt-3">
                <button onClick={handleGenerateLink} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm mr-2">Generate Link</button>
                {generatedLink && (
                    <button onClick={handleReset} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">Reset</button>
                )}
            </div>

            {generatedLink && (
                <div className="generated-link mt-3">
                    <p className="text-gray-600 mb-1 text-sm">Your Booking Link:</p>
                    <input type="text" value={generatedLink} readOnly ref={linkInputRef} className="w-full p-1 border rounded text-sm mb-1" />
                    <button onClick={handleCopyLink} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">Copy Link</button>
                </div>
            )}
        </div>
    );
};

export default LinkGenerator;
