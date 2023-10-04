"use client"
import React, { useState, useRef, useEffect } from 'react';
interface LinkGeneratorProps {
    id: string;
}
const LinkGenerator: React.FC<LinkGeneratorProps> = ({ id }) => {
    const [platform, setPlatform] = useState<string>('tiktok');
    const [accountId, setAccountId] = useState<string>(id ?? '');
    const [eventId, setEventId] = useState<string>('3b0bfa02-8d78-4865-ad91-405744270db4');
    const [generatedLink, setGeneratedLink] = useState<string>('');
    const linkInputRef = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
        // Check if all required values are set
        if (platform && accountId && eventId) {
            handleGenerateLink();
        }
    }, [platform, accountId, eventId]);
    const handleGenerateLink = () => {
        const baseUrl = "https://www.clubdenegocios.io/api/calendly?";
        const queryParams = `platform=${platform}&accountID=${accountId}&eventID=3b0bfa02-8d78-4865-ad91-405744270db4`;
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
        <div className="w-full link-generator p-4 shadow-md rounded-lg bg-[#272953]">
            <h2 className="text-lg font-medium text-white mb-3">Generate Booking Link:</h2>

            <div className="input-group mb-3">
                <label className="block text-white only:mb-1 text-sm">Social Media Platform:</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full p-1 border rounded text-sm">
                    <option value="">Select Platform</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option> {/* Adjusted the value */}
                </select>
            </div>
            
            <div className="input-group mb-3">
                <label className="block text-white mb-1 text-sm">Event ID:</label>
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
                    <p className="text-white mb-1 text-sm">Your Booking Link:</p>
                    <input type="text" value={generatedLink} readOnly ref={linkInputRef} className="w-full p-1 border rounded text-sm mb-1" />
                    <button onClick={handleCopyLink} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">Copy Link</button>
                </div>
            )}
        </div>
    );
};

export default LinkGenerator;
