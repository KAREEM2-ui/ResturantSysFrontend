import { useId, useState } from "react";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function EntityManagementCard({
  title,
  description,
  data,
  columns,
  rowActions,
  onAction,
  pagination,
  emptyMessage = "No records found.",
  Actions,
  isSelectable = false,
  onSelectionChange,
  onSelectable,
  selectedRowId,
}) {
  const rows = data ?? [];
  const [internalSelectedRowId, setInternalSelectedRowId] = useState(null);
  const radioGroupName = useId();
  const headerActions = Array.isArray(Actions) ? Actions : Actions ? [Actions] : [];
  const currentPage = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 10;
  const totalItems = pagination?.total ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const visiblePages = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, null, totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, null, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, null, currentPage, null, totalPages];
  })();

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const activeSelectedRowId = selectedRowId ?? internalSelectedRowId;

  const handleSelectRow = (row) => {
    if (selectedRowId === undefined) {
      setInternalSelectedRowId(row.id);
    }

    onSelectable?.(row);
    onSelectionChange?.(row);
  };

  const goToPage = (page) => {
    if (!pagination?.onPageChange) {
      return;
    }

    const targetPage = Math.max(1, Math.min(page, totalPages));
    if (targetPage !== currentPage) {
      pagination.onPageChange(targetPage);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>

          {headerActions.length ? (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              {headerActions.map((action, index) => (
                <Button
                  key={`${action?.label ?? "action"}-${index}`}
                  type="button"
                  onClick={action?.onClick}
                >
                  {action?.icon}
                  {action?.label ?? "Action"}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              {isSelectable ? <TableHead className="w-12" /> : null}
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}

              {!isSelectable ? <TableHead className="w-12" /> : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length ? (
              rows.map((row) => {
                if (isSelectable) {
                  return (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer transition hover:bg-muted/50"
                      onClick={() => handleSelectRow(row)}
                    >
                      <TableCell className="w-12" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="radio"
                          name={radioGroupName}
                          checked={activeSelectedRowId === row.id}
                          onChange={() => handleSelectRow(row)}
                          onClick={(event) => event.stopPropagation()}
                          className="h-4 w-4 cursor-pointer accent-primary"
                          aria-label={`Select ${row.id}`}
                        />
                      </TableCell>

                      {columns.map((column) => (
                        <TableCell key={`${row.id}-${column.key}`}>
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                }

                return (
                  <DropdownMenu key={row.id}>
                    <DropdownMenuTrigger asChild>
                    <TableRow className="transition hover:bg-muted/50">
                      {columns.map((column) => (
                        <TableCell key={`${row.id}-${column.key}`}>
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </TableCell>
                      ))}

                      <TableCell className="text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Open actions for ${rowActions.label(row)}`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>{rowActions.label(row)}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {rowActions.items(row).map((action) => (
                        <DropdownMenuItem
                          key={action.label}
                          onClick={() => {
                            action.onClick?.(row);
                            onAction?.(action, row);
                          }}
                        >
                          {action.icon ?? <ChevronRight className="h-4 w-4" />}
                          <span>{action.label}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {pagination ? (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {startItem} to {endItem} of {totalItems} entries
            </p>

            <Pagination className="mx-0 w-auto justify-start sm:justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {visiblePages.map((page, index) => (
                  <PaginationItem key={page ?? `ellipsis-${index}`}>
                    {page ? (
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(event) => {
                          event.preventDefault();
                          goToPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
