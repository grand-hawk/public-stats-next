import { Popover as ChakraPopover, IconButton, Portal } from '@chakra-ui/react';
import React from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

export interface ToggleTipProps extends ChakraPopover.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content?: React.ReactNode;
  contentProps?: ChakraPopover.ContentProps;
  // hover support props
  openDelay?: number;
  closeDelay?: number;
  disabled?: boolean;
}

export const ToggleTip = React.forwardRef<HTMLDivElement, ToggleTipProps>(
  function ToggleTip(props, ref) {
    const {
      children,
      closeDelay = 100,
      content,
      contentProps,
      disabled,
      onOpenChange,
      open: controlledOpen,
      openDelay = 200,
      portalRef,
      portalled = true,
      showArrow,
      ...rest
    } = props;

    const [isOpen, setIsOpen] = React.useState(false);
    const openTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : isOpen;

    const clearTimeouts = () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current);
        openTimeoutRef.current = null;
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };

    React.useEffect(() => {
      return () => clearTimeouts();
    }, []);

    const handleOpen = () => {
      clearTimeouts();
      openTimeoutRef.current = setTimeout(() => {
        if (!isControlled) setIsOpen(true);
        onOpenChange?.({ open: true });
      }, openDelay);
    };

    const handleClose = () => {
      clearTimeouts();
      closeTimeoutRef.current = setTimeout(() => {
        if (!isControlled) setIsOpen(false);
        onOpenChange?.({ open: false });
      }, closeDelay);
    };

    const handleOpenChange = (details: { open: boolean }) => {
      clearTimeouts();
      if (!isControlled) setIsOpen(details.open);
      onOpenChange?.(details);
    };

    if (disabled) return children;

    return (
      <ChakraPopover.Root
        {...rest}
        open={open}
        onOpenChange={handleOpenChange}
        positioning={{ ...rest.positioning, gutter: 4 }}
      >
        <ChakraPopover.Trigger
          asChild
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
        >
          {children}
        </ChakraPopover.Trigger>
        <Portal container={portalRef} disabled={!portalled}>
          <ChakraPopover.Positioner>
            <ChakraPopover.Content
              ref={ref}
              bg="bg.inverted"
              borderRadius="l2"
              boxShadow="md"
              color="fg.inverted"
              fontWeight="medium"
              maxW="xs"
              px="2.5"
              py="1"
              textStyle="xs"
              width="auto"
              onMouseEnter={clearTimeouts}
              onMouseLeave={handleClose}
              {...contentProps}
            >
              {showArrow && (
                <ChakraPopover.Arrow>
                  <ChakraPopover.ArrowTip />
                </ChakraPopover.Arrow>
              )}
              {content}
            </ChakraPopover.Content>
          </ChakraPopover.Positioner>
        </Portal>
      </ChakraPopover.Root>
    );
  },
);

export const InfoTip = React.forwardRef<
  HTMLDivElement,
  Partial<ToggleTipProps>
>(function InfoTip(props, ref) {
  const { children, ...rest } = props;
  return (
    <ToggleTip content={children} {...rest} ref={ref}>
      <IconButton
        aria-label="info"
        colorPalette="gray"
        size="2xs"
        variant="ghost"
      >
        <HiOutlineInformationCircle />
      </IconButton>
    </ToggleTip>
  );
});
