import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { chit_get_url, chit_add_url, customer_get_url,addchit } from "./url/url";
import { useEffect, useState } from "react";

const Add_chit = () => {
  const { register, control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      chit_det: {
        chit_name: "",
        Tolal_amount: "",
        Due_amount: "",
        time_preiod: "",
      },
      member_list: [{ name: "", member_id: "", phone: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "member_list",
  });
  
  
  const [customerList, setCustomerList] = useState([]);
  const [chitList, setChitList] = useState([]);
  const [editChitIndex, setEditChitIndex] = useState(null);

  useEffect(() => {
    fetchCustomerList();
    fetchChitList();
  }, []);

  const fetchCustomerList = async () => {
    try {
      const res = await axios.get(customer_get_url);
      setCustomerList(res.data.customers);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  const fetchChitList = async () => {
    try {
      const res = await axios.get('http://127.0.01:8000/api/v1/chits');
      setChitList(res.data.chits);
      console.log("chitlist",res.data.chits)
    } catch (error) {
      console.error("Error fetching chit list:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      let response;
      
      if (editChitIndex !== null) {
        response = await axios.put(`http://127.0.0.1:8000/api/v1/chit/${data._id}`, data);
        console.log("Chit updated:", response.data);
        setEditChitIndex(null);
      } else {
        response = await axios.post(addchit, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Check if the response indicates success
        if (response.status === 200 || response.status === 201) {
          console.log("Chit added:", response.data);
        } else {
          console.warn("Failed to add chit:", response.data);
        }
      }
      
      reset();
      await fetchChitList(); // Ensure this fetches the latest data
    } catch (error) {
      // Log the error if the request fails
      console.error("Error while submitting data:", error.response ? error.response.data : error.message);
    }
  };
  

  const onEditChit = (index) => {
    const chitToEdit = chitList[index];
    setEditChitIndex(index);
    reset({
      _id: chitToEdit._id,
      chit_det: {
        chit_name: chitToEdit.chit_det.chit_name,
        Tolal_amount: chitToEdit.chit_det.Tolal_amount,
        Due_amount: chitToEdit.chit_det.Due_amount,
        time_preiod: chitToEdit.chit_det.time_preiod,
      },
      member_list: chitToEdit.member_list,
    });
  };

  const customerListId = (index) => `customer-list-${index}`;

  const onAddProduct = () => {
    append({ name: "", member_id: "", phone: "" });
  };

  const getCustomerDetails = (name) => {
    const customer = customerList.find((customer) => customer.name === name);
    return customer ? { id: customer._id, phone: customer.phone } : { id: "", phone: "" };
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">
          <div className="left-inputs">
            <div>
              <label>Chit Name:</label>
              <input
                {...register("chit_det.chit_name")}
                placeholder="Chit Name"
              />
            </div>
            <div>
              <label>Chit Amount:</label>
              <input
                {...register("chit_det.Tolal_amount")}
                placeholder="Total Amount"
              />
            </div>
          </div>

          <div className="right-inputs">
            <div>
              <label>Due Amount:</label>
              <input
                {...register("chit_det.Due_amount")}
                placeholder="Due Amount"
              />
            </div>
            <div>
              <label>Time Period:</label>
              <input
                {...register("chit_det.time_preiod")}
                placeholder="Time Period"
              />
            </div>
          </div>
        </div>

        <div className="member-list-container">
          <table>
            <tbody>
              {fields.map((item, index) => (
                <tr key={item.id}>
                  <td>
                    <input
                      {...register(`member_list.${index}.name`)}
                      placeholder="Member Name"
                      list={customerListId(index)}
                      onChange={(e) => {
                        const { id, phone } = getCustomerDetails(e.target.value);
                        setValue(`member_list.${index}.member_id`, id);
                        setValue(`member_list.${index}.phone`, phone);
                      }}
                    />
                    <datalist id={customerListId(index)}>
                      {customerList.map((option, optionIndex) => (
                        <option key={optionIndex} value={option.name}>
                          {option.name}
                        </option>
                      ))}
                    </datalist>
                    <input
                      type="hidden"
                      {...register(`member_list.${index}.member_id`)}
                    />
                    <input
                      type="hidden"
                      {...register(`member_list.${index}.phone`)}
                    />
                  </td>
                  <td>
                    <input
                      {...register(`member_list.${index}.phone`)}
                      placeholder="Phone"
                      readOnly
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => remove(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={onAddProduct}>
            Add Member
          </button>
        </div>

        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Chit List</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Chit Name</th>
                <th>Total Amount</th>
                <th>Due Amount</th>
                <th>Time Period</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chitList.map((chit, index) => (
                <tr key={index}>
                  <td>{chit.chit_det.chit_name}</td>
                  <td>{chit.chit_det.Tolal_amount}</td>
                  <td>{chit.chit_det.Due_amount}</td>
                  <td>{chit.chit_det.time_preiod}</td>
                  <td>
                    <ul>
                      {chit.member_list.map((member, memIndex) => (
                        <li key={memIndex}>
                          {member.name} - {member.phone}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button onClick={() => onEditChit(index)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Add_chit;
