import React, { useEffect, useState } from "react";
import axios from "axios";
import { chitdue_amount_update_url, dueamountunwind_url } from "./url/url";
import ReactPaginate from "react-paginate";
import "./chit.css"; // Import CSS file for styling

const Chit = () => {
  const [PaidAmount, SetPaidAmount] = useState("");
  const [oldPaidAmount, SetoldPaidAmount] = useState("");
  const [chitduememberlist, setChitduememberlist] = useState([]);
  const [pendingAmount, SetpendingAmount] = useState("");
  const [oldpendingAmount, SetoldpendingAmount] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [itemsPerPage] = useState(500);
  const [todaydate, settodaydate] = useState("");
  const [selecttodaydate, setselecttodaydate] = useState("");
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    getchitduememberlist();
    const today = new Date().toISOString().split("T")[0];
    settodaydate(today);
    setselecttodaydate(today);
  }, []);

  useEffect(() => {
    let totalPaid = 0;
    let totalPending = 0;
    chitduememberlist.forEach((member) => {
      totalPaid += parseFloat(member.member.paid_amount);
      totalPending += parseFloat(member.member.pending_amount);
    });
    setTotalPaidAmount(totalPaid);
    setTotalPendingAmount(totalPending);
  }, [chitduememberlist]);

  const getchitduememberlist = async () => {
    try {
      const response = await axios.get(dueamountunwind_url);
      setChitduememberlist(response.data.chits);
    } catch (error) {
      console.error("Error fetching chit master list:", error);
    }
  };

  const handleUpdate = async () => {
    const totallpaid = parseFloat(oldPaidAmount) + parseFloat(PaidAmount);
    console.log(totallpaid);
    try {
      const payload = {
        id: selectedMember._id,
        paidamount: totallpaid,
        amount: pendingAmount,
        memberId: selectedMember.member.member_id,
        paidStatus: selectedOption,
        amount_date: selecttodaydate,
        current_paid_amount: PaidAmount,
        date: selecttodaydate,
      };
      const response = await axios.post(chitdue_amount_update_url, payload);
      console.log(response.data);
      setShowModal(false);
      getchitduememberlist();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const openModal = (member) => {
    setSelectedMember(member);
    SetoldpendingAmount(member.member.pending_amount);
    SetoldPaidAmount(member.member.paid_amount);
    setShowModal(true);
  };

  const indexOfLastItem = (pageNumber + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = chitduememberlist.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const pageCount = Math.ceil(chitduememberlist.length / itemsPerPage);

  const pendingcal = (e) => {
    SetPaidAmount(e);
    const pending = oldpendingAmount - e;
    SetpendingAmount(pending);
  };

  return (
    <div>
      <h5>Due List</h5>

      <div className="table-wrapper">
        <table>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{totalPaidAmount}</td>
            <td>{totalPendingAmount}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Call</th>
              <th>SMS</th>
              <th>WhatsApp</th>
              <th>Paid</th>
              <th>Pending</th>
              <th>Action</th>
              <th>Chit Name</th>
              <th>Amount</th>
              <th>List</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {currentItems
              .slice()
              .reverse()
              .map((member, index) => (
                <tr key={index}>
                  <td>{member.member.name}</td>
                  <td><a href={`tel:${member.member.phone}`} className="call-icon">&#9990;</a></td>
                  <td><a href={`sms:${member.member.phone}?body=Balance details`}>SMS</a></td>
                  <td><a href={`https://wa.me/91${member.member.phone}`} target="_blank" rel="noopener noreferrer">WhatsApp</a></td>
                  <td>{member.member.paid_amount}</td>
                  <td>{member.member.pending_amount}</td>
                  <td>
                    {parseInt(member.member.paid_amount) !== parseInt(member.amount) ? (
                      <button onClick={() => openModal(member)}>Pay</button>
                    ) : (
                      <span>No Due</span>
                    )}
                  </td>
                  <td>{member.chit_name}</td>
                  <td>{member.amount}</td>
                  <td>{member.chit_list}</td>
                  <td>{member.date}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      />

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Pay Amount</h2>
            <input
              type="text"
              value={PaidAmount}
              onChange={(e) => pendingcal(e.target.value)}
            />
            <div style={{ width: "100%" }}>
              <input
                type="text"
                value={pendingAmount}
                onChange={(e) => SetpendingAmount(e.target.value)}
                readOnly
              />
              <input
                type="date"
                value={todaydate}
                onChange={(e) => setselecttodaydate(e.target.value)}
              />
            </div>
            <div>
              <p>Paid Amount: {oldPaidAmount}, Pending Amount: {oldpendingAmount}</p>
            </div>

            <div>
              <label htmlFor="paymentSelect">Select Payment:</label>
              <select
                id="paymentSelect"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="paid">Paid</option>
                <option value="notPaid">Not Paid</option>
              </select>
              {selectedOption && (
                <p>You selected: {selectedOption === "paid" ? "Paid" : "Not Paid"}</p>
              )}
            </div>

            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div>
        <p>Total Paid Amount: {totalPaidAmount}</p>
        <p>Total Pending Amount: {totalPendingAmount}</p>
      </div>
    </div>
  );
};

export default Chit;