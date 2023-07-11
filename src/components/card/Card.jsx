import React from "react";

export default function Card ({ img, onClick }) {
  return (
    <div className="card" onClick={onClick}> 
      <img src={img} alt="" />
    </div>
  )
}