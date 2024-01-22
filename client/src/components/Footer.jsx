import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-slate-700 text-white  mt-6 py-4">
          <div className="container mx-auto text-center">
            <p className="text-sm font-bold">
              © {new Date().getFullYear()} WakoriEstates. All rights reserved. 
            </p>
            <p className='font-light text-sm'>
            Designed by Wakori Tech.
            </p>
          </div>
        </footer>
      )
}
