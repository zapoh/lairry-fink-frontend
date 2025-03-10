import { useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// AI model options (using lab/company names)
const AI_MODELS = [
  { id: 'openai', name: 'OpenAI' },
  { id: 'anthropic', name: 'Anthropic' },
  { id: 'google', name: 'Google' },
  { id: 'meta', name: 'Meta' },
  { id: 'mistral', name: 'Mistral' },
  { id: 'ollama', name: 'Ollama' },
  { id: 'xai', name: 'xAI' },
  { id: 'groq', name: 'Groq' },
  { id: 'deepseek', name: 'Deepseek' }
];

// Platform options
const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X' },
  { id: 'discord', name: 'Discord' },
  { id: 'telegram', name: 'Telegram' }
];

export default function AgentPage() {
  const { isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for form
  const [characterFile, setCharacterFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.type !== 'application/json') {
      setError('Please upload a JSON file');
      setCharacterFile(null);
      return;
    }
    setCharacterFile(file);
    setError(null);
  };

  // Handle platform selection
  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else {
        return [...prev, platformId];
      }
    });
  };

  // Handle model selection
  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!characterFile) {
      setError('Please upload a character file');
      return;
    }
    
    if (!selectedModel) {
      setError('Please select an AI model');
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    
    setIsDeploying(true);
    setError(null);
    
    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful deployment
      setCharacterFile(null);
      setSelectedModel('');
      setSelectedPlatforms([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to deploy agent');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        {isConnected ? (
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-primary">Agent Deployer</h1>
            
            <div className="bg-background-light rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Character File Upload */}
                <div>
                  <label className="block text-gray-100 font-medium mb-2">
                    Character File
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Choose File
                    </button>
                    <span className="text-gray-400">
                      {characterFile ? characterFile.name : 'No file chosen'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    Upload a JSON character file
                  </p>
                </div>
                
                {/* AI Model Selection */}
                <div>
                  <label htmlFor="model" className="block text-gray-100 font-medium mb-2">
                    Model
                  </label>
                  <select
                    id="model"
                    value={selectedModel}
                    onChange={handleModelChange}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                  >
                    <option value="">Select a model</option>
                    {AI_MODELS.map(model => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Platform Selection */}
                <div>
                  <label className="block text-gray-100 font-medium mb-2">
                    Platforms
                  </label>
                  <div className="space-y-2">
                    {PLATFORMS.map(platform => (
                      <div key={platform.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onChange={() => handlePlatformChange(platform.id)}
                          className="mr-2 h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary"
                        />
                        <label htmlFor={platform.id} className="text-gray-100">
                          {platform.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Error Message */}
                {error && (
                  <div className="text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isDeploying}
                  className="w-full bg-primary hover:bg-primary-600 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl"
                >
                  {isDeploying ? 'Deploying Agent...' : 'Deploy Agent'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-500">Connect Wallet Required</h1>
              <p className="text-gray-400 mt-2">Please connect your wallet to access the agent deployer.</p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 