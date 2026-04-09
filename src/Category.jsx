import React from "react";
import { TiThSmallOutline } from "react-icons/ti";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { TbSoup } from "react-icons/tb";
import { CiBowlNoodles } from "react-icons/ci";
import { MdOutlineFoodBank } from "react-icons/md";
import { GiFullPizza } from "react-icons/gi";
import { GiHamburger } from "react-icons/gi";
import ImageSlider from "./components/ImageSlider";

const Categories = [
  {
    id: 1,
    name: "All",
    icon: <TiThSmallOutline className="w-15 h-15 text-green-600" />,
  },
  {
    id: 2,
    name: "breakfast",
    icon: (
      <MdOutlineFreeBreakfast className="w-15 h-15 text-green-600" />
    ),
  },
  {
    id: 3,
    name: "soups",
    icon: <TbSoup className="w-15 h-15 text-green-600" />,
  },
  {
    id: 4,
    name: "pasta",
    icon: <CiBowlNoodles className="w-15 h-15 text-green-600" />,
  },
  {
    id: 5,
    name: "main_course",
    icon: <MdOutlineFoodBank className="w-15 h-15 text-green-600" />,
  },
  {
    id: 6,
    name: "pizza",
    icon: <GiFullPizza className="w-15 h-15 text-green-600" />,
  },
  {
    id: 7,
    name: "burger",
    icon: <GiHamburger className="w-15 h-15 text-green-600" />,
  },
];
const Category = ({ filterCategory }) => {
  return (
    <>
      <div className="flex flex-wrap justify-center items-center gap-6 mt-5 w-full ">
        {Categories.map((item) => {
          return (
            <div
              className="w-30 h-30 bg-white rounded-xl flex flex-col justify-start items-start gap-5 p-5 text-[15px] font-semibold transition-all duration-300 cursor-pointer border border-gray-300 hover:shadow-lg hover:-translate-y-1"
              onClick={() => filterCategory(item.name)}
              key={item.id}
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 90, 95, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              {React.cloneElement(item.icon, { style: {color: 'var(--coral-primary)'} })}
              <span style={{color: 'var(--text-dark)'}}>{item.name}</span>
            </div>
          );
        })}
      </div>

      <ImageSlider />
    </>
  );
};

export default Category; 