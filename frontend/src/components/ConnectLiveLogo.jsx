import React from 'react'
import { ShipWheelIcon } from "lucide-react";

const ConnectLiveLogo = () => {
  return (
    <div className="p-5  border-base-300">
        <div className="flex items-center gap-2 size-2xl">
          <ShipWheelIcon className="size-6 text-primary" />
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary  tracking-wider">
            ConnectLive
          </span>
        </div>
      </div>
  )
}

export default ConnectLiveLogo
