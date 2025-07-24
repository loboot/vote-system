package dto

type CreateVoteRequest struct {
	Title    string   `json:"title" binding:"required"`
	Options  []string `json:"options" binding:"required,min=2"`
	Multi    bool     `json:"multi"`
	Deadline int64    `json:"deadline"`
}

type UpdateVoteRequest struct {
	ID       uint     `json:"id" binding:"required"`
	Title    string   `json:"title" binding:"required"`
	Options  []string `json:"options" binding:"required,min=2"`
	Multi    bool     `json:"multi"`
	Deadline int64    `json:"deadline"`
}

type VoteRequest struct {
	VoteID    uint   `json:"vote_id" binding:"required"`
	OptionIDs []uint `json:"option_ids" binding:"required"`
}
