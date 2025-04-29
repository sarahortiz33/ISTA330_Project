import React from 'react';
import { Button } from 'react-bootstrap';

function FollowButton({ isFollowing, onFollow, onUnfollow }) {
    return (
        <Button
            size="sm"
            onClick={isFollowing ? onUnfollow : onFollow}
            style={{
                backgroundColor: "#f8c291",
                border: "none",
                color: "#4e342e",
                fontWeight: "bold",
                padding: "5px 12px",
                minWidth: "90px"
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f6b08b")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f8c291")}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}

export default FollowButton;
