import type { FC } from "react";
import type { LinkButtonProps } from "./types";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const LinkButton: FC<LinkButtonProps> = ({
  label,
  to,
  disabled = false
}) => (
  disabled ? (
    <Button disabled>
      {label}
    </Button>
  ) : (
    <Button asChild>
      <Link to={to}>
        {label}
      </Link>
    </Button>
  )
);
