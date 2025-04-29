import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FollowButton from '../components/FollowButton';
import { Modal, Button } from 'react-bootstrap';

const API_URL = 'http://localhost:5001';

function FollowersPage({ currentUserId }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [followingList, setFollowingList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchFollowing = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/api/followers/following/${currentUserId}`);
            setFollowingList(res.data);
        } catch (err) {
            console.error('Error fetching following list:', err);
        }
    }, [currentUserId]);

    useEffect(() => {
        fetchFollowing();
    }, [fetchFollowing]);

    async function handleSearch() {
        try {
            const res = await axios.get(`${API_URL}/api/followers/search?query=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) {
            console.error('Error searching users:', err);
        }
    }

    async function handleFollow(followingId) {
        try {
            await axios.post(`${API_URL}/api/followers/follow`, { followerId: currentUserId, followingId });
            fetchFollowing();
        } catch (err) {
            console.error('Error following user:', err);
        }
    }

    async function handleUnfollow(followingId) {
        try {
            await axios.post(`${API_URL}/api/followers/unfollow`, { followerId: currentUserId, followingId });
            fetchFollowing();
        } catch (err) {
            console.error('Error unfollowing user:', err);
        }
    }

    async function handleViewProfile(userId) {
        try {
            const res = await axios.get(`${API_URL}/api/followers/profile/${userId}`);
            setSelectedUser(res.data);
            setShowModal(true);
        } catch (err) {
            console.error('Error fetching user profile:', err);
        }
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    const formatDOB = (dob) => {
        if (!dob) return "Unknown";
        const dateObj = new Date(dob);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return dateObj.toLocaleDateString(undefined, options);
    };

    return (
        <div className="container" style={{ paddingTop: "60px", paddingBottom: "100px" }}>
            <h4 className="mt-5 mb-3">Followers</h4>

            {/* Search Users */}
            <div className="card mb-5 p-4" style={{ backgroundColor: "#fff8f0", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                <h4 className="mb-3">Search Users</h4>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by first or last name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button
                        className="btn"
                        style={{ backgroundColor: "#f8c291", color: "#4e342e", fontWeight: "bold", border: "none" }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="list-group">
                        {searchResults.map((user) => (
                            <div key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {user.first_name} {user.last_name}
                                <FollowButton
                                    isFollowing={followingList.some(f => f.id === user.id)}
                                    onFollow={() => handleFollow(user.id)}
                                    onUnfollow={() => handleUnfollow(user.id)}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Following List */}
            <div className="card p-4" style={{ backgroundColor: "#fff8f0", borderRadius: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                <h4 className="mb-3">My Following</h4>
                {followingList.length === 0 ? (
                    <p>You are not following anyone yet.</p>
                ) : (
                    <div className="list-group">
                        {followingList.map((user) => (
                            <div key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {user.first_name} {user.last_name}
                                <div>
                                    <Button
                                        size="sm"
                                        style={{ backgroundColor: "#f8c291", border: "none", color: "#4e342e", fontWeight: "bold", marginRight: "8px" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
                                        onClick={() => handleViewProfile(user.id)}
                                    >
                                        View Profile
                                    </Button>
                                    <Button
                                        size="sm"
                                        style={{ backgroundColor: "#f8c291", border: "none", color: "#4e342e", fontWeight: "bold" }}
                                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
                                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
                                        onClick={() => handleUnfollow(user.id)}
                                    >
                                        Unfollow
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for viewing user profile */}
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                contentClassName="custom-modal"
            >
                <Modal.Header closeButton style={{ borderBottom: "none", borderRadius: "15px 15px 0 0", backgroundColor: "#fff8f0" }}>
                    <Modal.Title style={{ fontWeight: "bold" }}>User Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: "#fff8f0", borderRadius: "0 0 15px 15px" }}>
                    {selectedUser ? (
                        <>
                            <p><strong>Full Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</p>
                            <p><strong>Date of Birth:</strong> {formatDOB(selectedUser.dob)}</p>
                            <p><strong>Status:</strong> {selectedUser.status || "No status available"}</p>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </Modal.Body>

            </Modal>

        </div>
    );
}

export default FollowersPage;