import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Contract ABI for TeacherRegistry
const TEACHER_REGISTRY_ABI = [
  "function registerTeacher(string calldata handle, address teacherAddress) external",
  "function updateTeacherAddress(string calldata handle, address newTeacherAddress) external", 
  "function removeTeacher(string calldata handle) external",
  "function getTeacherAddress(string calldata handle) external view returns (address)",
  "function getTeacherHandle(address teacherAddress) external view returns (string)",
  "function isHandleRegistered(string calldata handle) external view returns (bool)",
  "function owner() external view returns (address)"
];


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newHandle, setNewHandle] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [searchHandle, setSearchHandle] = useState('');
  const [searchResult, setSearchResult] = useState<string>('');
  // const [teacherInfo, setTeacherInfo] = useState<any>(null);
  // const [loadingTeacherInfo, setLoadingTeacherInfo] = useState(false);

  const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET_KEY;
  const REGISTRY_ADDRESS = import.meta.env.VITE_TEACHER_REGISTRY_ADDRESS;
  const RPC_URL = import.meta.env.VITE_RPC_URL;

  const handleLogin = async () => {
    if (secretKey !== ADMIN_SECRET) {
      alert('Invalid secret key!');
      return;
    }

    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const adminWallet = new ethers.Wallet(import.meta.env.VITE_ADMIN_PRIVATE_KEY || '', provider);
      const registryContract = new ethers.Contract(REGISTRY_ADDRESS, TEACHER_REGISTRY_ABI, adminWallet);

      setWallet(adminWallet);
      setContract(registryContract);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Check console for details.');
    }
  };

  const registerTeacher = async () => {
    if (!contract || !newHandle || !newAddress) return;
    
    try {
      setLoading(true);
      const tx = await contract.registerTeacher(newHandle, newAddress);
      await tx.wait();
      alert(`Teacher ${newHandle} registered successfully!`);
      setNewHandle('');
      setNewAddress('');
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const searchTeacher = async () => {
    if (!contract || !searchHandle) return;
    
    try {
      setLoading(true);
      const address = await contract.getTeacherAddress(searchHandle);
      setSearchResult(address === ethers.ZeroAddress ? 'Not found' : address);
    } catch (error: any) {
      console.error('Search failed:', error);
      setSearchResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeTeacher = async (handle: string) => {
    if (!contract) return;
    
    if (!confirm(`Are you sure you want to remove teacher ${handle}?`)) return;
    
    try {
      setLoading(true);
      const tx = await contract.removeTeacher(handle);
      await tx.wait();
      alert(`Teacher ${handle} removed successfully!`);
    } catch (error: any) {
      console.error('Removal failed:', error);
      alert(`Removal failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <h1>Yoga Escrow Admin Dashboard</h1>
        <div className="login-form">
          <input
            type="password"
            placeholder="Enter admin secret key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header>
        <h1>Teacher Registry Admin</h1>
        <p>Registry: {REGISTRY_ADDRESS}</p>
        <p>Admin: {wallet?.address}</p>
        <button onClick={() => setIsAuthenticated(false)}>Logout</button>
      </header>

      <div className="dashboard-grid">
        {/* Register Teacher */}
        <div className="card">
          <h2>Register New Teacher</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Teacher handle (e.g., @yogamaster)"
              value={newHandle}
              onChange={(e) => setNewHandle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Teacher wallet address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <button 
              onClick={registerTeacher} 
              disabled={loading || !newHandle || !newAddress}
            >
              {loading ? 'Registering...' : 'Register Teacher'}
            </button>
          </div>
        </div>

        {/* Search Teacher */}
        <div className="card">
          <h2>Search Teacher</h2>
          <div className="form-group">
            <input
              type="text"
              placeholder="Teacher handle to search"
              value={searchHandle}
              onChange={(e) => setSearchHandle(e.target.value)}
            />
            <button 
              onClick={searchTeacher} 
              disabled={loading || !searchHandle}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searchResult && (
              <div className="search-result">
                <strong>Result:</strong> {searchResult}
                {searchResult !== 'Not found' && searchResult.startsWith('0x') && (
                  <button 
                    onClick={() => removeTeacher(searchHandle)}
                    className="remove-btn"
                    disabled={loading}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button onClick={() => {
              setNewHandle('@yogamaster');
              setNewAddress('0x1234567890123456789012345678901234567890');
            }}>
              Demo Teacher 1
            </button>
            <button onClick={() => {
              setNewHandle('@zenflow');
              setNewAddress('0x2345678901234567890123456789012345678901');
            }}>
              Demo Teacher 2
            </button>
            <button onClick={() => {
              setNewHandle('@vinyasapro');
              setNewAddress('0x3456789012345678901234567890123456789012');
            }}>
              Demo Teacher 3
            </button>
          </div>
        </div>

        {/* Contract Information */}
        <div className="card full-width">
          <h2>Contract Information</h2>
          <div className="contract-info">
            <p><strong>Registry Address:</strong> {REGISTRY_ADDRESS}</p>
            <p><strong>Network:</strong> Base Sepolia (84532)</p>
            <p><strong>Explorer:</strong> 
              <a 
                href={`https://sepolia.basescan.org/address/${REGISTRY_ADDRESS}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on BaseScan
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App
