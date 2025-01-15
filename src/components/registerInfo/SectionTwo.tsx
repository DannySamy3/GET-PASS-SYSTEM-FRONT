import React, { useEffect } from "react";
import { fetchCountries } from "@/utils/helper";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showToast } from "@/utils/toastSlice";

interface Country {
  name: {
    common: string;
  };
}

export const SectionTwo = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const dispatch = useDispatch();
  const handleCountries = async () => {
    try {
      const data = await fetchCountries();
      const sortedData = data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sortedData);
    } catch (error) {
      dispatch(
        showToast({ message: "Failed to fetch countries", type: "error" })
      );
    }
  };
  useEffect(() => {
    handleCountries();
  }, []);
  return (
    <section className='w-[98%] mx-auto grid grid-cols-[0.18fr_0.4fr] items-center justify-center gap-y-6'>
      <label className='text-[#515253] font-[500]'>Email</label>
      <label className=' text-[#515253] font-[500]'>
        danielntunduye@gmail.com
      </label>

      <label className='text-[#515253] font-[500]'>Gender</label>
      <select className='select select-bordered text-[#515253] font-[500]'>
        <option className='text-[#515253] '>Select Gender</option>
        <option className='text-[#515253] ' value='Male'>
          Male
        </option>
        <option value='Female'>Female</option>
      </select>

      <label className='text-[#515253] font-[500]'>Country</label>
      <select className='select select-bordered text-[#515253] font-[500]'>
        <option>Select Country</option>
        {countries.map((country, i) => (
          <option key={i} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
      </select>

      <label className='text-[#515253] font-[500]'>Phone Number</label>
      <div className='relative'>
        <input
          name='text'
          placeholder=' Enter Phone Number'
          className='input input-bordered text-sm w-full pr-10 text-[#515253] font-[500]'
          required
        />
      </div>

      <div className='w-[100%] my-3 col-start-2'>
        <button className='bg-[#4CAF50] text-[14px] font-[600] border w-full py-3 text-white rounded-lg'>
          Register
        </button>
      </div>
    </section>
  );
};

export default SectionTwo;
