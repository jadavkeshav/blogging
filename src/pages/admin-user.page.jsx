import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TextField,
    TableSortLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "personal_info.fullname", direction: "asc" });
    const { userAuth: { access_token } } = useContext(UserContext);

    const fetchUsers = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-all-users", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(({ data: { users } }) => {
                setUsers(users);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = (userId) => {
        axios.delete(import.meta.env.VITE_SERVER_DOMAIN + `/delete-user/${userId}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(() => {
                setUsers(users.filter(user => user._id !== userId));
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleShowProfile = (username) => {
        navigate(`/user/${username}`);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((value, key) => value[key], obj);
    };

    const sortData = (data) => {
        return data.sort((a, b) => {
            const aValue = getNestedValue(a, sortConfig.key);
            const bValue = getNestedValue(b, sortConfig.key);
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const filteredUsers = users.filter(user => {
        const searchQueryLower = searchQuery.toLowerCase();
        return (
            user.personal_info.fullname.toLowerCase().includes(searchQueryLower) ||
            user.personal_info.email.toLowerCase().includes(searchQueryLower) ||
            user.personal_info.username.toLowerCase().includes(searchQueryLower) ||
            user.personal_info.bio.toLowerCase().includes(searchQueryLower) ||
            user.account_info.total_posts.toString().includes(searchQueryLower) ||
            user.account_info.total_reads.toString().includes(searchQueryLower) ||
            new Date(user.joinedAt).toLocaleDateString().includes(searchQueryLower)
        );
    });

    const sortedUsers = sortData(filteredUsers);

    return (
        <div className="flex flex-col items-center justify-center p-4 text-gray-800 w-[90%]">
            <h1 className="text-4xl font-bold text-center mb-8">Admin Users</h1>
            <div className="w-full mb-4 ">
                <TextField
                    type="search"
                    label="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    className="mb-4 w-[25%] max-sm:w-[100%]" 
                />
            </div>
            <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Profile Image</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'personal_info.fullname'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('personal_info.fullname')}
                                >
                                    Full Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'personal_info.email'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('personal_info.email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'personal_info.username'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('personal_info.username')}
                                >
                                    Username
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'personal_info.bio'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('personal_info.bio')}
                                >
                                    Bio
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'account_info.total_posts'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('account_info.total_posts')}
                                >
                                    Total Posts
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'account_info.total_reads'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('account_info.total_reads')}
                                >
                                    Total Reads
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'joinedAt'}
                                    direction={sortConfig.direction}
                                    onClick={() => handleSort('joinedAt')}
                                >
                                    Joined At
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell style={{ maxWidth: '100px' }}>
                                    <img src={user.personal_info.profile_img} alt={`${user.personal_info.fullname}'s profile`} className="  object-cover rounded-full" />
                                </TableCell>
                                <TableCell>{user.personal_info.fullname}</TableCell>
                                <TableCell>{user.personal_info.email}</TableCell>
                                <TableCell>@{user.personal_info.username}</TableCell>
                                <TableCell>{user.personal_info.bio}</TableCell>
                                <TableCell>{user.account_info.total_posts}</TableCell>
                                <TableCell>{user.account_info.total_reads.toLocaleString()}</TableCell>
                                <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleShowProfile(user.personal_info.username)}
                                    >
                                        Show Profile
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
);
};

export default AdminUsers;

