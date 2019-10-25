module.exports = `
dropdown: css({
  background: "white",
  padding: "40px",
  borderRadius: "3px",
  boxShadow: "0 0 20px rgba(0,0,0,0.1)",
  minWidth: "200px",
  "& ul, li, a, p": {
    marginRight: "0 !important",
    padding: "0 !important"
  },
  "& ul p": {
    marginBottom: "12px"
  },
  "& li:last-of-type p": {
    marginBottom: "0px"
  },
  "& li:hover p": {
    opacity: "0.5"
  },
  "& img": {
    maxWidth: "50px",
    borderRadius: "50%",
    marginRight: "20px",
    display: "inline-block"
  },
  ...responsive("tablet", {
    display: "none"
  })
}),
`
.substr(1)
.slice(0, -1)