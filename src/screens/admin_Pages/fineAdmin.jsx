import React, { useEffect, useState } from "react";
import "../../styling/fine.css";
import Sidebar from "../../components/sideBar";
import AppBar from "../../components/appBar";
import { payCatalogFineByCash , payCatalogBookFineByCash } from "../../services/adminFineService";
import { fetchCatalogs } from '../../services/catalogService';
import { fetchUsers } from '../../services/userService';
import AdminFineHeader from "./admin_components/adminFineHeader"; // Adjust the import path as necessary
import { useMemo } from 'react';


const FinePage = () => {
    const [catalogs, setCatalogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('unpaid');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const onUserChange = (userId) => {
        setSelectedUserId(userId);
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersData = await fetchUsers();
                setUsers(usersData);

                const allCatalogs = [];
                for (const user of usersData) {
                    const userCatalogs = await fetchCatalogs(user._id);
                    const catalogsArray = Array.isArray(userCatalogs) ? userCatalogs : [userCatalogs];
                    catalogsArray.forEach(cat => {
                        cat.userId = user._id; // attach user id
                    });
                    allCatalogs.push(...catalogsArray);
                }
                setCatalogs(allCatalogs);
            } catch (error) {
                console.error("Error fetching user-wise catalogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    // Helper functions
    const getTotalFine = (catalog) => {
        return catalog.catalogBooks.reduce((total, item) => total + item.fine, 0);
    };

    const getUnpaidFine = (catalog) => {
        return catalog.catalogBooks.reduce((total, item) => {
            return total + (item.finePaid ? 0 : item.fine);
        }, 0);
    };

    const isCatalogFullyPaid = (catalog) => {
        return catalog.catalogBooks.every(item => item.finePaid || item.fine === 0);
    };

    const isCatalogPartiallyPaid = (catalog) => {
        const hasUnpaidFines = catalog.catalogBooks.some(item => !item.finePaid && item.fine > 0);
        const hasPaidFines = catalog.catalogBooks.some(item => item.finePaid && item.fine > 0);
        return hasUnpaidFines && hasPaidFines;
    };

    const isCatalogUnpaid = (catalog) => {
        return catalog.catalogBooks.every(item => !item.finePaid) && getTotalFine(catalog) > 0;
    };

    const getCatalogsWithFines = () => {
        return catalogs.filter(catalog => getTotalFine(catalog) > 0);
    };

    const getFilteredCatalogs = () => {
        let catalogsWithFines = getCatalogsWithFines();
        if (selectedUserId) {
            catalogsWithFines = catalogsWithFines.filter(c => c.userId === selectedUserId);
        }

        if (activeTab === 'paid') {
            return catalogsWithFines.filter(catalog => isCatalogFullyPaid(catalog));
        } else if (activeTab === 'partial') {
            return catalogsWithFines.filter(catalog => isCatalogPartiallyPaid(catalog));
        } else if (activeTab === 'unpaid') {
            return catalogsWithFines.filter(catalog => isCatalogUnpaid(catalog));
        }
        return catalogsWithFines;
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusBadge = (catalog) => {
        const totalFine = getTotalFine(catalog);
        const unpaidFine = getUnpaidFine(catalog);

        if (totalFine === 0) return null;

        if (unpaidFine === 0) {
            return <span className="status-badge completed">Fully Paid</span>;
        } else if (unpaidFine === totalFine) {
            return <span className="status-badge overdue">Unpaid</span>;
        } else {
            return <span className="status-badge pending">Partially Paid</span>;
        }
    };

    const getCatalogCounts = () => {
        let catalogsWithFines = getCatalogsWithFines();

        if (selectedUserId) {
            catalogsWithFines = catalogsWithFines.filter(c => c.userId === selectedUserId);
        }

        const paid = catalogsWithFines.filter(catalog => isCatalogFullyPaid(catalog)).length;
        const partial = catalogsWithFines.filter(catalog => isCatalogPartiallyPaid(catalog)).length;
        const unpaid = catalogsWithFines.filter(catalog => isCatalogUnpaid(catalog)).length;

        return { paid, partial, unpaid, total: catalogsWithFines.length };
    };

    const filteredCatalogs = getFilteredCatalogs();
    const catalogCounts = useMemo(() => getCatalogCounts(), [catalogs, selectedUserId]);
    const totalRemainingFines = getCatalogsWithFines()
        .reduce((sum, cat) => sum + getUnpaidFine(cat), 0);
    const selectedUserRemainingFine = useMemo(() => {
        if (!selectedUserId) return 0;
        const catalogsWithFines = getCatalogsWithFines().filter(c => c.userId === selectedUserId);
        return catalogsWithFines.reduce((sum, cat) => sum + getUnpaidFine(cat), 0);
    }, [catalogs, selectedUserId]);



    return (
        <div className="library-page">
            <Sidebar />
            <div className="main-contentb">
                <AppBar />
                <br />
                <div className="fine-container">
                    {loading ? (
                        <div className="loader">Loading...</div>
                    ) : (
                        <AdminFineHeader
                            users={users}
                            totalRemainingFines={totalRemainingFines}
                            selectedUserId={selectedUserId}
                            onUserChange={onUserChange}
                            // need pass remainin fine count of selected user
                            selectedUserRemainingFine={selectedUserRemainingFine}

                        />

                    )}

                    <div className="fine-details-section">
                        <div className="tabs-container">
                            <div className="tab-buttons">
                                <button
                                    className={activeTab === 'unpaid' ? 'active unpaid-tab' : 'unpaid-tab'}
                                    onClick={() => setActiveTab('unpaid')}
                                >
                                    Unpaid Fines
                                    {catalogCounts.unpaid > 0 && <span className="tab-count unpaid-count">{catalogCounts.unpaid}</span>}
                                </button>
                                <button
                                    className={activeTab === 'partial' ? 'active partial-tab' : 'partial-tab'}
                                    onClick={() => setActiveTab('partial')}
                                >
                                    Partially Paid
                                    {catalogCounts.partial > 0 && <span className="tab-count partial-count">{catalogCounts.partial}</span>}
                                </button>
                                <button
                                    className={activeTab === 'paid' ? 'active paid-tab' : 'paid-tab'}
                                    onClick={() => setActiveTab('paid')}
                                >
                                    Fully Paid
                                    {catalogCounts.paid > 0 && <span className="tab-count paid-count">{catalogCounts.paid}</span>}
                                </button>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <p>Loading catalogs...</p>
                                </div>
                            ) : (
                                <div className="catalogs-container">
                                    {filteredCatalogs.length > 0 ? (
                                        filteredCatalogs.map((catalog) => (
                                            <div key={catalog.id} className="catalog-card">
                                                <div className="catalog-header">
                                                    <div className="catalog-info">
                                                        <h3>Catalog ID: {catalog.id}</h3>
                                                        <h4>Total Books: {catalog.quantity}</h4>
                                                        <div>
                                                            <p className="fine-amount">
                                                                <strong>Total Fine:</strong> Rs. {getTotalFine(catalog).toFixed(2)}
                                                            </p>
                                                        </div>
                                                        {getStatusBadge(catalog)}
                                                    </div>
                                                    <div className="catalog-dates">
                                                        <p><strong>Borrowed:</strong> {formatDate(catalog.borrowDate)}</p>
                                                        <p><strong>Due:</strong> {formatDate(catalog.expiredDate)}</p>
                                                        {getUnpaidFine(catalog) > 0 && (
                                                            <p className="fine-amount unpaid-fine">
                                                                <strong>Remaining:</strong> Rs. {getUnpaidFine(catalog).toFixed(2)}
                                                            </p>
                                                        )}
                                                        <div className="catalog-actions">
                                                            {!isCatalogFullyPaid(catalog) && (
                                                                <button
                                                                    className="catalog-pay-button"
                                                                    onClick={async () => {
                                                                        const confirmPay = window.confirm(`Do you want to pay the fine for Catalog ID: ${catalog.id}?`);
                                                                        if (confirmPay) {
                                                                            const result = await payCatalogFineByCash(catalog.id);
                                                                            console.log("Payment Result:", result);
                                                                            if (result) {
                                                                                window.open(result, '_blank');
                                                                            } else {
                                                                                alert('Failed to generate payment link.');
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    Pay Fine
                                                                </button>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="books-list">
                                                    <h4>Books with fines:</h4>
                                                    <div className="table-wrapper">
                                                        <table className="books-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>Catalog Book ID</th>
                                                                    <th>Title</th>
                                                                    <th>Author</th>
                                                                    <th>Fine Amount</th>
                                                                    <th>Payment Status</th>
                                                                    <th>Return Status</th>
                                                                    <th>Pay</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {catalog.catalogBooks
                                                                    .filter(item => item.fine > 0)
                                                                    .map((item) => (
                                                                        <tr key={item.id}>
                                                                            <td>{item.id}</td>
                                                                            <td>{item.book.title}</td>
                                                                            <td>{item.book.author}</td>
                                                                            <td className="fine-amount">
                                                                                Rs. {item.fine.toFixed(2)}
                                                                            </td>
                                                                            <td>
                                                                                <span className={`status-indicator ${item.finePaid ? 'paid' : 'unpaid'}`}>
                                                                                    {item.finePaid ? 'Paid' : 'Unpaid'}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <span className={`status-indicator ${item.returnState ? 'returned' : 'not-returned'}`}>
                                                                                    {item.returnState ? 'Returned' : 'Not Returned'}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                {!item.finePaid && (
                                                                                    <button
                                                                                        className="pay-button"
                                                                                        onClick={async () => {
                                                                                            const confirmPay = window.confirm(`Do you want to pay the fine for catalog book ID: ${item.id}?`);
                                                                                            if (confirmPay) {
                                                                                                const result = await payCatalogBookFineByCash(catalog.id, item._id);
                                                                                                if (result?.startsWith('http')) {
                                                                                                    window.open(result, '_blank');
                                                                                                } else {
                                                                                                    alert('Failed to generate payment link.');
                                                                                                }
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        Pay-Fine
                                                                                    </button>
                                                                                )}
                                                                            </td>

                                                                        </tr>
                                                                    ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="no-data">
                                            <p>No catalogs with {activeTab} fines found.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinePage;