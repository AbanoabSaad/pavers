import { ReactElement } from "react";
import { SocialIcon } from 'react-social-icons';
import Social from "../types/Social";

export default function Footer(): ReactElement {

  const socialMedia: Social[] = [
    { name: 'instagram', url: 'https://www.instagram.com/pavers_shoes/'},
    { name: 'youtube', url: 'https://www.youtube.com/c/paversshoes'},
    { name: 'twitter', url: 'https://twitter.com/PaversShoes'},
    { name: 'facebook', url: 'https://www.facebook.com/pavers.shoes'},
    { name: 'pinterest', url: 'https://www.pinterest.co.uk/paversshoes'}
  ]

  return (
    <div className="flex items-center justify-between flex-col gap-4 md:flex-row bg-[#eff1f6] md:px-[10%] px-6 py-5 text-black">
      <div className="flex gap-2">
        {socialMedia.map((x: Social) => 
          <SocialIcon style={{ height: 40, width: 40 }} target="_blank" key={x.name} network={x.name} url={x.url}/>
        )}
      </div>
      <p>&copy; 2022 Pavers LTD</p>
    </div>
  )
}