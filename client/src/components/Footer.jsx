import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-slate-700 text-white py-4">
          <div className="container mx-auto text-center">
            <p className="text-sm font-bold">
              © {new Date().getFullYear()} WakoriEstates. All rights reserved. <br />
              Designed by Wakori Tech.
            </p>
          </div>
        </footer>
      )
}
