import React from "react";

import { server, useQuery } from "../../lib/api";
import { DeleteListing, DeleteListingVariables, ListingsData } from "./types";

interface ListingsProps { }

const LISTINGS = `
  query Listings {
      listings {
          id
          title
          image
          address
          price
          numOfGuests
          numOfBeds
          numOfBaths
          rating
      }
  }  
`;
const DELETE_LISTING = `
  mutation DeleteListing($id: ID!) {
      deleteListing(id: $id) {
          id
          title
          image
          address
          price
          numOfGuests
          numOfBeds
          numOfBaths
          rating
      }
  }  
`;

export const Listings: React.FunctionComponent<ListingsProps> = ({ }) => {
    const { data } = useQuery<ListingsData>(LISTINGS);

    const deleteListing = async (id: string) => {
        await server.fetch<DeleteListing, DeleteListingVariables>({
            query: DELETE_LISTING,
            variables: { id: id },
        });
    };

    const listings = data ? data.listings : null;

    const listingsList = listings ? (
        <ul>
            {listings.map((listing) => (
                <li key={listing.id}>
                    {listing.title}
                    <button onClick={() => deleteListing(listing.id)}>Delete</button>
                </li>
            ))}
        </ul>
    ) : null;

    return (
        <div>
            <h1>TinyHouse listings!</h1>
            {listingsList}
            <h1>Delete listing!</h1>
        </div>
    );
};
