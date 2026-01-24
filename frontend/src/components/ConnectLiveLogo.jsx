import React from 'react'
import { Link } from 'react-router';
import { ShipWheelIcon } from "lucide-react";

const ConnectLiveLogo = () => {
  return (
    <div className="p-5 border-b border-base-300">
        <Link to="/" className="flex items-center gap-2.5">
          <ShipWheelIcon className="size-9 text-primary" />
          <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary  tracking-wider">
            Streamify
          </span>
        </Link>
      </div>
  )
}

export default ConnectLiveLogo
