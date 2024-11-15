import axios from "axios";
import React, { useEffect, useState } from "react";
import { customer_get_url, customer_add_url, customer_delete_url, customer_edit_url } from "./url/url";
import "./coustomer.css";

const Coustomer = () => {
  const [cuslist, setCuslist] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pending_flag, setPending_flag] = useState(false);
  const [Status, SetStatus] = useState("");  
  const [OldBlance, setOldBlance] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editCustomer, setEditCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, SetPageSize] = useState(20);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [PayShowModal,setPayShowModal] =useState(false)
  //filter
  const [filtername,Setfiltername] =useState("")

  const addCusPost = async () => {
    const data = { name, phone, pending_flag, OldBlance, Status };
    try {
      await axios.post('http://localhost:8000/api/v1/customer', data);
      cusGetList();
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  const cusGetList = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/customers', {
        params: { page: currentPage, limit: pageSize,keyword:filtername}
      });
      setCuslist(res.data.customers);
      setTotalRecords(res.data.totalRecords);
      SetPageSize(res.data.pageSize); // Adjust page size if necessary
      setCurrentPage(res.data.currentPage); // Adjust current page if necessary
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };
  

  const deleteCus = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/v1/customer/${editCustomer._id}`);
      cusGetList();
    } catch (error) {
      console.error("Error occurred while deleting customer:", error);
    }
  };

  const updateCusPost = async () => {
    const data = { name, phone, pending_flag, OldBlance, Status };
    try {
      await axios.put(`http://localhost:8000/api/v1/customer/${editCustomer._id}`, data);
      cusGetList(); // Refresh the customer list after the update
    } catch (error) {
      console.error("Error updating customer:", error);
    }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid phone number");
      return;
    }
    isEditing ? await updateCusPost() : await addCusPost();
    setShowModal(false);
  };

  const openPayModalfu = (member) => {
    setPayShowModal(true);
    console.log(member)
  };

  const handleEdit = (customer) => {
    setName(customer.name);
    setPhone(customer.phone);
    setPending_flag(customer.pending_flag);
    setOldBlance(customer.OldBlance);
    SetStatus(customer.Status);
    setEditCustomer(customer);
    setIsEditing(true);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalRecords / pageSize);

  useEffect(() => {
    cusGetList();
  }, [currentPage, pageSize,filtername]);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Add Customer</button>
      <div className="row"><div className="col-6">
        <label>name:</label>
        <input
         type="text"
         value={filtername}
         onChange={(e) => Setfiltername(e.target.value)}
         placeholder="Name"
        /></div></div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <form onSubmit={handleSubmit}>
              <h1>{isEditing ? "Edit Customer" : "Add Customer"}</h1>
              <label>Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <label>Phone:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
              <label>
                Pending Flag:
                <input
                  type="checkbox"
                  checked={pending_flag}
                  onChange={(e) => setPending_flag(e.target.checked)}
                />
              </label>
              <label>Balance:</label>
              <input
                type="text"
                required
                value={OldBlance}
                onChange={(e) => setOldBlance(e.target.value)}
                placeholder="Balance"
              />
              <label>Status:</label>
              <select
                id="paymentSelect"
                value={Status}
                onChange={(e) => SetStatus(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="alive">Alive</option>
                <option value="Waiting">Waiting</option>
                <option value="OFF">OFF</option>
              </select>
              <button type="submit">{isEditing ? "Save Changes" : "Add"}</button>
            </form>
          </div>
        </div>
      )}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Balance</th>
              <th>button</th>
              <th>Call</th>
              <th>SMS</th>
              <th>WhatsApp</th>
              <th>Phone</th>
              <th>Pending Flag</th>
              <th>Views</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="11">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="11">{error}</td></tr>
            ) : (
              cuslist.map((customer, index) => (
                <tr key={customer._id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}</td>
                  <td>{customer.name}</td>
                  <td>{customer.OldBlance}</td>
                  <td><button onClick={() => openPayModalfu(customer)}>Pay</button></td>
                  <td>
                    <a href={`tel:${customer.phone}`} className="call-icon">
                      <i>&#9990;</i>
                    </a>
                  </td>
                  <td>
                    <a
                      href={`sms:${customer.phone}?body=Your last balance: ${customer.OldBlance},%0APlease pay it as soon as possible`}
                    >
                      SMS
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://wa.me/91${customer.phone}?text=Your old balance: ${customer.OldBlance}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </td>
                  <td>{customer.phone}</td>
                  <td>{customer.pending_flag ? "Yes" : "No"}</td>
                  <td>
                    <a href={`/views/${customer._id}`}>Views</a>
                  </td>
                  <td>{customer.Status}</td>
                  <td>
                    <button onClick={() => handleEdit(customer)}>Edit</button>
                    <button onClick={() => deleteCus(customer._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Coustomer;
