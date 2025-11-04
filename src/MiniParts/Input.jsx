import React from "react";
function MyInput({type, name, id, placeHolder, onChange, value, req}){
    return(
    <input type={type} id={id} name={name} placeholder={placeHolder}
    onChange={onChange} value={value} required = {req}
    className="w-full p-2 mb-4 outline-0 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 bg-white text-gray-800 placeholder-gray-500"
    />
)
}
export default MyInput