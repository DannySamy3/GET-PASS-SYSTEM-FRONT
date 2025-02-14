"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";
import Header from "../reUsables/Header";
import {
  getSponsors,
  createSponsors,
  deleteSponsors,
  getSponsorById,
  editSponsors,
} from "@/utils/sponsorController";
import ToastNotification from "@/components/toastNotification/ToastNotification";

interface SponsorData {
  [key: string]: string;
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<SponsorData>({
    name: "",
    Amount: "",
  });
  const dispatch = useDispatch();

  const gradientColors = [
    "bg-gradient-to-r from-pink-500 to-yellow-500",
    "bg-gradient-to-r from-purple-400 to-blue-400",
    "bg-gradient-to-r from-green-300 to-teal-500",
  ];

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await getSponsors();
      setSponsors(response?.data?.data || []);
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message:
            err.response?.data?.message ||
            "Network issue, please check your connection.",
          type: "error",
        })
      );
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSponsorData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateOrUpdateSponsor = async () => {
    try {
      if (isEditing) {
        await editSponsors(sponsorData.id, sponsorData);
        dispatch(showToast({ message: "Edit Successful!", type: "success" }));
      } else {
        await createSponsors(sponsorData);
        dispatch(showToast({ message: "Sponsor created!", type: "success" }));
      }
      resetForm();
      fetchSponsors();
    } catch (error) {
      resetForm();
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Action failed",
          type: "error",
        })
      );
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const response = await getSponsorById(id);
      const { name, Amount } = response?.data?.data || {};
      setSponsorData({ name, Amount, id });
      setIsEditing(true);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch sponsor details", type: "error" })
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSponsors(id);
      dispatch(showToast({ message: "Sponsor Deleted", type: "success" }));
      fetchSponsors();
    } catch (error) {
      const err = error as { response: { data: { message: string } } };
      dispatch(
        showToast({
          message: err.response?.data?.message || "Deletion failed",
          type: "error",
        })
      );
    }
  };

  const resetForm = () => {
    setSponsorData({ name: "", Amount: "" });
    setIsEditing(false);
  };

  const renderSponsorsList = () => {
    return sponsors.map((sponsor, index) => (
      <React.Fragment key={sponsor._id}>
        <div className='flex gap-2'>
          <label
            className={`w-4 h-4 rounded-full shadow-md ${
              gradientColors[index % gradientColors.length]
            } mr-4`}
          ></label>
          <label className='text-[#515748] font-[500] text-[15px]'>
            {sponsor.name}
          </label>
        </div>
        <label className='text-[#515748] font-[400] ml-2 text-[15px]'>
          {new Intl.NumberFormat("en-US").format(sponsor.Amount)}/=
        </label>
        <label className='text-[#515748] ml-2 font-[600] text-[15px]'>
          20%
        </label>
        <div className='flex gap-6'>
          <svg
            onClick={() => handleEdit(sponsor._id)}
            className='cursor-pointer'
            width='24'
            height='24'
            viewBox='0 0 35 36'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x='0.5'
              y='0.5'
              width='34'
              height='35'
              rx='5.5'
              stroke='#585858'
            />
            <path
              d='M17 11H12C11.4696 11 10.9609 11.2107 10.5858 11.5858C10.2107 11.9609 10 12.4696 10 13V24C10 24.5304 10.2107 25.0391 10.5858 25.4142C10.9609 25.7893 11.4696 26 12 26H23C23.5304 26 24.0391 25.7893 24.4142 25.4142C24.7893 25.0391 25 24.5304 25 24V19M23.586 9.58601C23.7705 9.39499 23.9912 9.24262 24.2352 9.13781C24.4792 9.03299 24.7416 8.97782 25.0072 8.97551C25.2728 8.9732 25.5361 9.0238 25.7819 9.12437C26.0277 9.22493 26.251 9.37343 26.4388 9.56122C26.6266 9.74901 26.7751 9.97231 26.8756 10.2181C26.9762 10.4639 27.0268 10.7273 27.0245 10.9928C27.0222 11.2584 26.967 11.5208 26.8622 11.7648C26.7574 12.0088 26.605 12.2295 26.414 12.414L17.828 21H15V18.172L23.586 9.58601Z'
              stroke='black'
            />
          </svg>
          <svg
            onClick={() => handleDelete(sponsor._id)}
            className='cursor-pointer'
            width='24'
            height='24'
            viewBox='0 0 35 36'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <rect
              x='0.5'
              y='0.5'
              width='34'
              height='35'
              rx='5.5'
              stroke='#585858'
            />
            <path
              d='M25 13L24.133 25.142C24.0971 25.6466 23.8713 26.1188 23.5011 26.4636C23.1309 26.8083 22.6439 27 22.138 27H13.862C13.3561 27 12.8691 26.8083 12.4989 26.4636C12.1287 26.1188 11.9029 25.6466 11.867 25.142L11 13M16 17V23M20 17V23M21 13V10C21 9.73478 20.8946 9.48043 20.7071 9.29289C20.5196 9.10536 20.2652 9 20 9H16C15.7348 9 15.4804 9.10536 15.2929 9.29289C15.1054 9.48043 15 9.73478 15 10V13M10 13H26'
              stroke='black'
            />
          </svg>
        </div>
      </React.Fragment>
    ));
  };

  return (
    <div className='w-full max-w-full px-4 sm:px-6 font-montserrat'>
      <Header title='Sponsors' view={() => {}} />

      <section className='mx-auto w-[98%] mt-16 py-10 px-8 h-[170px] overflow-y-scroll border border-[#E3E2E2] rounded-[12px]'>
        <div className='flex gap-[30%] items-center justify-center'>
          <div className='flex gap-4 items-center w-[40%]'>
            <label className='text-[#383A3A] font-[500] text-[17px]'>
              Name
            </label>
            <input
              name='name'
              value={sponsorData.name}
              onChange={handleInputChange}
              type='text'
              className='input input-sm w-[75%] bg-white border border-[#DBDADA] rounded-[8px]'
            />
          </div>
          <div className='flex gap-4 items-center w-[40%]'>
            <label className='text-[#383A3A] font-[500] text-[17px]'>
              Mini Amount
            </label>
            <input
              name='Amount'
              value={sponsorData.Amount}
              onChange={handleInputChange}
              type='text'
              className='input input-sm w-[70%] bg-white border border-[#DBDADA] rounded-[8px]'
            />
          </div>
        </div>
        <div className='mt-6 flex justify-end'>
          <button
            onClick={handleCreateOrUpdateSponsor}
            className={`btn btn-success w-[10%] text-white font-[600] ${
              isEditing ? "btn-error" : "bg-[#3A7563]"
            }`}
          >
            {isEditing ? "SAVE" : "CREATE"}
          </button>
        </div>
      </section>

      <section className='px-20 py-7 gap-y-6 my-10 mx-auto w-[98%] bg-[#FDFDFD] border border-[#D6D4D4] rounded-xl h-[400px] overflow-y-auto'>
        <div className='grid grid-cols-[1.2fr_1.2fr_1.2fr_0.2fr] gap-y-6'>
          <label className='text-[#383A3A] font-[500] text-base'>Name</label>
          <label className='text-[#383A3A] font-[500] text-base'>
            Mini Amount
          </label>
          <label className='text-[#383A3A] font-[500] text-base'>Usage</label>
          <label className='text-[#383A3A] font-[500] text-base'>Actions</label>
        </div>

        <div className='overflow-y-auto grid grid-cols-[1.2fr_1.2fr_1.2fr_0.2fr] gap-y-6 mt-5 max-h-[400px]'>
          {renderSponsorsList()}
        </div>
      </section>

      <ToastNotification />
    </div>
  );
};

export default Sponsors;
